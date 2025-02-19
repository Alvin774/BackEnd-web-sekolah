const PPDBCarousel = require('../models/PPDBCarousel');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Helper: Fungsi untuk mengupload file buffer ke Cloudinary
const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

/**
 * GET /api/ppdbcarousel
 * Mengambil semua data PPDB Carousel, diurutkan berdasarkan field `order` secara ascending.
 */
exports.getAllCarousel = async (req, res) => {
  try {
    const carousels = await PPDBCarousel.findAll({ order: [['order', 'ASC']] });
    res.json(carousels);
  } catch (error) {
    console.error("Error fetching PPDB Carousel data:", error);
    res.status(500).json({ message: "Error fetching PPDB Carousel data", error: error.message });
  }
};

/**
 * POST /api/ppdbcarousel
 * Menambahkan data PPDB Carousel baru.
 * Menggunakan multer untuk upload file (field 'image') ke Cloudinary.
 */
exports.addCarousel = async (req, res) => {
  try {
    const { captionTitle, captionDescription, linkUrl, order } = req.body;
    
    // Validasi wajib: captionTitle dan captionDescription
    if (!captionTitle || !captionDescription) {
      return res.status(400).json({ message: "Caption title dan description wajib diisi." });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Gambar untuk carousel wajib diupload." });
    }
    
    // Upload file ke Cloudinary pada folder 'ppdbcarousel'
    const result = await uploadFromBuffer(req.file.buffer, 'ppdbcarousel');
    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;
    
    const newCarousel = await PPDBCarousel.create({
      imageUrl,
      imagePublicId,
      captionTitle,
      captionDescription,
      linkUrl,
      order: order || 0,
    });
    
    res.status(201).json({ message: "PPDB Carousel berhasil ditambahkan", carousel: newCarousel });
  } catch (error) {
    console.error("Error adding PPDB Carousel:", error);
    res.status(500).json({ message: "Error adding PPDB Carousel", error: error.message });
  }
};

/**
 * PUT /api/ppdbcarousel/:id
 * Memperbarui data PPDB Carousel berdasarkan ID.
 * Jika ada file baru yang diupload, file gambar lama akan dihapus dari Cloudinary dan diganti dengan yang baru.
 */
exports.updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const { captionTitle, captionDescription, linkUrl, order } = req.body;
    const carousel = await PPDBCarousel.findByPk(id);
    
    if (!carousel) {
      return res.status(404).json({ message: "Data PPDB Carousel tidak ditemukan" });
    }
    
    // Jika ada file baru yang diupload, hapus gambar lama dari Cloudinary jika ada
    if (req.file) {
      if (carousel.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(carousel.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'ppdbcarousel');
      carousel.imageUrl = result.secure_url;
      carousel.imagePublicId = result.public_id;
    }
    
    // Update field lainnya
    carousel.captionTitle = captionTitle !== undefined ? captionTitle : carousel.captionTitle;
    carousel.captionDescription = captionDescription !== undefined ? captionDescription : carousel.captionDescription;
    carousel.linkUrl = linkUrl !== undefined ? linkUrl : carousel.linkUrl;
    carousel.order = order !== undefined ? order : carousel.order;
    
    await carousel.save();
    res.json({ message: "PPDB Carousel berhasil diperbarui", carousel });
  } catch (error) {
    console.error("Error updating PPDB Carousel:", error);
    res.status(500).json({ message: "Error updating PPDB Carousel", error: error.message });
  }
};

/**
 * DELETE /api/ppdbcarousel/:id
 * Menghapus data PPDB Carousel berdasarkan ID, serta menghapus file gambar terkait dari Cloudinary jika ada.
 */
exports.deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const carousel = await PPDBCarousel.findByPk(id);
    if (!carousel) {
      return res.status(404).json({ message: "Data PPDB Carousel tidak ditemukan" });
    }
    if (carousel.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(carousel.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    await carousel.destroy();
    res.json({ message: "PPDB Carousel berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PPDB Carousel:", error);
    res.status(500).json({ message: "Error deleting PPDB Carousel", error: error.message });
  }
};
