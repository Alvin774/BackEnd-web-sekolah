// controllers/ppdbCarouselController.js

const PPDBCarousel = require('../models/PPDBCarousel');
const fs = require('fs');
const path = require('path');

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
 * Mendukung upload file untuk gambar (field 'image').
 */
exports.addCarousel = async (req, res) => {
  try {
    const { captionTitle, captionDescription, linkUrl, order } = req.body;
    let imageUrl = null;
    
    // Validasi wajib: imageUrl, captionTitle, dan captionDescription
    if (!captionTitle || !captionDescription) {
      return res.status(400).json({ message: "Caption title dan description wajib diisi." });
    }
    
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    } else {
      return res.status(400).json({ message: "Gambar untuk carousel wajib diupload." });
    }
    
    const newCarousel = await PPDBCarousel.create({
      imageUrl,
      captionTitle,
      captionDescription,
      linkUrl,
      order: order || 0
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
 * Jika ada file baru yang diupload, file gambar lama akan dihapus (jika ada).
 */
exports.updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const { captionTitle, captionDescription, linkUrl, order } = req.body;
    const carousel = await PPDBCarousel.findByPk(id);
    
    if (!carousel) {
      return res.status(404).json({ message: "Data PPDB Carousel tidak ditemukan" });
    }
    
    // Jika ada file baru, hapus file gambar lama dan update imageUrl
    if (req.file) {
      if (carousel.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', carousel.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      carousel.imageUrl = '/public/uploads/' + req.file.filename;
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
 * Menghapus data PPDB Carousel berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const carousel = await PPDBCarousel.findByPk(id);
    if (!carousel) {
      return res.status(404).json({ message: "Data PPDB Carousel tidak ditemukan" });
    }
    if (carousel.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', carousel.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });
    }
    await carousel.destroy();
    res.json({ message: "PPDB Carousel berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PPDB Carousel:", error);
    res.status(500).json({ message: "Error deleting PPDB Carousel", error: error.message });
  }
};
