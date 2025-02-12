// controllers/alurPendaftaranController.js

const AlurPendaftaran = require('../models/AlurPendaftaran');
const fs = require('fs');
const path = require('path');

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
 * Menggunakan multer untuk upload file (field 'image').
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
    const imageUrl = '/public/uploads/' + req.file.filename;
    const newStep = await AlurPendaftaran.create({
      stepNumber,
      description,
      imageUrl
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
 * Jika ada file baru diupload, gambar lama akan dihapus.
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
      if (step.imageUrl) {
        const oldPath = path.join(__dirname, '..', 'public', step.imageUrl.substring(1));
        fs.unlink(oldPath, err => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      step.imageUrl = '/public/uploads/' + req.file.filename;
    }
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
 * Menghapus data alur pendaftaran berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deleteAlurPendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await AlurPendaftaran.findByPk(id);
    if (!step) {
      return res.status(404).json({ message: "Alur pendaftaran tidak ditemukan" });
    }
    if (step.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', step.imageUrl.substring(1));
      fs.unlink(filePath, err => {
        if (err) console.error("Error deleting image:", err);
      });
    }
    await step.destroy();
    res.json({ message: "Alur pendaftaran berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting alur pendaftaran:", error);
    res.status(500).json({ message: "Error deleting alur pendaftaran", error: error.message });
  }
};
