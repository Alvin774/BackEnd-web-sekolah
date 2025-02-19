// controllers/alurPendaftaranController.js

const AlurPendaftaran = require('../models/AlurPendaftaran');
const cloudinary = require('../config/cloudinary'); // Pastikan file ini sudah disiapkan
const path = require('path');

// Helper: Fungsi untuk mengupload buffer ke Cloudinary
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
 * GET /api/alurpendaftaran
 * Mengambil semua data alur pendaftaran, diurutkan berdasarkan stepNumber secara ascending.
 */
exports.getAllAlurPendaftaran = async (req, res) => {
  try {
    const steps = await AlurPendaftaran.findAll({ order: [['stepNumber', 'ASC']] });
    res.json(steps);
  } catch (error) {
    console.error("Error fetching alur pendaftaran:", error);
    res.status(500).json({ message: "Error fetching alur pendaftaran", error: error.message });
  }
};

/**
 * POST /api/alurpendaftaran
 * Menambahkan data alur pendaftaran baru.
 * Menggunakan multer untuk upload file (field 'image') ke Cloudinary.
 */
exports.addAlurPendaftaran = async (req, res) => {
  try {
    const { stepNumber, description } = req.body;
    if (!stepNumber || !description) {
      return res.status(400).json({ message: "Step number dan description wajib diisi." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Gambar untuk alur pendaftaran wajib diupload." });
    }
    
    // Upload file ke Cloudinary
    const result = await uploadFromBuffer(req.file.buffer, 'alurpendaftaran');
    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;
    
    const newStep = await AlurPendaftaran.create({
      stepNumber,
      description,
      imageUrl,
      imagePublicId
    });
    res.status(201).json({ message: "Alur pendaftaran berhasil ditambahkan", step: newStep });
  } catch (error) {
    console.error("Error adding alur pendaftaran:", error);
    res.status(500).json({ message: "Error adding alur pendaftaran", error: error.message });
  }
};

/**
 * PUT /api/alurpendaftaran/:id
 * Memperbarui data alur pendaftaran berdasarkan ID.
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary.
 */
exports.updateAlurPendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber, description } = req.body;
    const step = await AlurPendaftaran.findByPk(id);
    if (!step) {
      return res.status(404).json({ message: "Alur pendaftaran tidak ditemukan" });
    }
    
    if (req.file) {
      // Jika ada imagePublicId sebelumnya, hapus gambar lama dari Cloudinary
      if (step.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(step.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'alurpendaftaran');
      step.imageUrl = result.secure_url;
      step.imagePublicId = result.public_id;
    }
    
    // Perbarui field lainnya
    step.stepNumber = stepNumber !== undefined ? stepNumber : step.stepNumber;
    step.description = description !== undefined ? description : step.description;
    
    await step.save();
    res.json({ message: "Alur pendaftaran berhasil diperbarui", step });
  } catch (error) {
    console.error("Error updating alur pendaftaran:", error);
    res.status(500).json({ message: "Error updating alur pendaftaran", error: error.message });
  }
};

/**
 * DELETE /api/alurpendaftaran/:id
 * Menghapus data alur pendaftaran berdasarkan ID, serta menghapus gambar dari Cloudinary jika ada.
 */
exports.deleteAlurPendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await AlurPendaftaran.findByPk(id);
    if (!step) {
      return res.status(404).json({ message: "Alur pendaftaran tidak ditemukan" });
    }
    if (step.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(step.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    await step.destroy();
    res.json({ message: "Alur pendaftaran berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting alur pendaftaran:", error);
    res.status(500).json({ message: "Error deleting alur pendaftaran", error: error.message });
  }
};
