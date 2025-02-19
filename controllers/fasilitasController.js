const Fasilitas = require('../models/Fasilitas');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Helper: Fungsi untuk mengupload file buffer ke Cloudinary
const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
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
 * GET /api/fasilitas
 * Mengambil semua data fasilitas, diurutkan berdasarkan waktu dibuat (terbaru pertama).
 */
exports.getAllFasilitas = async (req, res) => {
  try {
    const fasilitasList = await Fasilitas.findAll({ order: [['createdAt', 'DESC']] });
    res.json(fasilitasList);
  } catch (error) {
    console.error("Error fetching fasilitas:", error);
    res.status(500).json({ message: "Error fetching fasilitas", error: error.message });
  }
};

/**
 * POST /api/fasilitas
 * Menambahkan data fasilitas baru.
 * Mendukung upload file untuk gambar fasilitas (field 'image') ke Cloudinary.
 */
exports.addFasilitas = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nama fasilitas wajib diisi" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Gambar fasilitas wajib diupload" });
    }
    
    // Upload gambar ke Cloudinary di folder 'fasilitas'
    const result = await uploadFromBuffer(req.file.buffer, 'fasilitas');
    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;
    
    const newFasilitas = await Fasilitas.create({
      name,
      imageUrl,
      imagePublicId
    });
    
    res.status(201).json({ message: "Fasilitas berhasil ditambahkan", fasilitas: newFasilitas });
  } catch (error) {
    console.error("Error adding fasilitas:", error);
    res.status(500).json({ message: "Error adding fasilitas", error: error.message });
  }
};

/**
 * PUT /api/fasilitas/:id
 * Memperbarui data fasilitas berdasarkan ID.
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary.
 */
exports.updateFasilitas = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const fasilitas = await Fasilitas.findByPk(id);
    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }
    
    if (req.file) {
      // Hapus gambar lama dari Cloudinary jika ada
      if (fasilitas.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(fasilitas.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'fasilitas');
      fasilitas.imageUrl = result.secure_url;
      fasilitas.imagePublicId = result.public_id;
    }
    
    fasilitas.name = name !== undefined ? name : fasilitas.name;
    
    await fasilitas.save();
    res.json({ message: "Fasilitas berhasil diperbarui", fasilitas });
  } catch (error) {
    console.error("Error updating fasilitas:", error);
    res.status(500).json({ message: "Error updating fasilitas", error: error.message });
  }
};

/**
 * DELETE /api/fasilitas/:id
 * Menghapus data fasilitas berdasarkan ID, serta menghapus gambar dari Cloudinary jika ada.
 */
exports.deleteFasilitas = async (req, res) => {
  try {
    const { id } = req.params;
    const fasilitas = await Fasilitas.findByPk(id);
    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }
    if (fasilitas.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(fasilitas.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    await fasilitas.destroy();
    res.json({ message: "Fasilitas berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting fasilitas:", error);
    res.status(500).json({ message: "Error deleting fasilitas", error: error.message });
  }
};
