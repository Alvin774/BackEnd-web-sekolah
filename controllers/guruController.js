const Guru = require('../models/Guru');
const cloudinary = require('../config/cloudinary'); // Pastikan file ini sudah dikonfigurasi dengan benar
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
 * GET /api/guru
 * Mengambil semua data guru, diurutkan berdasarkan waktu dibuat (terbaru pertama).
 */
exports.getAllGuru = async (req, res) => {
  try {
    const gurus = await Guru.findAll({ order: [['createdAt', 'DESC']] });
    res.json(gurus);
  } catch (error) {
    console.error("Error fetching guru:", error);
    res.status(500).json({ message: "Error fetching guru", error: error.message });
  }
};

/**
 * POST /api/guru
 * Menambahkan data guru baru.
 * Mendukung file upload untuk foto guru (field 'image') ke Cloudinary.
 */
exports.addGuru = async (req, res) => {
  try {
    const { name, nip } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    
    let imageUrl = null;
    let imagePublicId = null;
    
    if (req.file) {
      // Upload file ke Cloudinary di folder 'guru'
      const result = await uploadFromBuffer(req.file.buffer, 'guru');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    
    const guru = await Guru.create({ name, nip, imageUrl, imagePublicId });
    res.status(201).json({ message: "Guru added successfully", guru });
  } catch (error) {
    console.error("Error adding guru:", error);
    res.status(500).json({ message: "Error adding guru", error: error.message });
  }
};

/**
 * PUT /api/guru/:id
 * Memperbarui data guru berdasarkan ID.
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary.
 */
exports.updateGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nip } = req.body;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru not found" });
    }
    
    if (req.file) {
      // Hapus gambar lama dari Cloudinary jika ada
      if (guru.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(guru.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'guru');
      guru.imageUrl = result.secure_url;
      guru.imagePublicId = result.public_id;
    }
    
    guru.name = name !== undefined ? name : guru.name;
    guru.nip = nip !== undefined ? nip : guru.nip;
    await guru.save();
    res.json({ message: "Guru updated successfully", guru });
  } catch (error) {
    console.error("Error updating guru:", error);
    res.status(500).json({ message: "Error updating guru", error: error.message });
  }
};

/**
 * DELETE /api/guru/:id
 * Menghapus data guru berdasarkan ID, serta menghapus file foto terkait dari Cloudinary jika ada.
 */
exports.deleteGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru not found" });
    }
    if (guru.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(guru.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    await guru.destroy();
    res.json({ message: "Guru deleted successfully" });
  } catch (error) {
    console.error("Error deleting guru:", error);
    res.status(500).json({ message: "Error deleting guru", error: error.message });
  }
};
