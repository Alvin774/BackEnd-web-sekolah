// controllers/ppdbBrosurController.js

const PPDBBrosur = require('../models/PPDBBrosur');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/ppdbbrosur
 * Mengambil semua data PPDB Brosur.
 */
exports.getAllPPDBBrosur = async (req, res) => {
  try {
    const brosurs = await PPDBBrosur.findAll({ order: [['createdAt', 'DESC']] });
    res.json(brosurs);
  } catch (error) {
    console.error("Error fetching PPDB Brosur:", error);
    res.status(500).json({ message: "Error fetching PPDB Brosur", error: error.message });
  }
};

/**
 * POST /api/ppdbbrosur
 * Menambahkan data PPDB Brosur baru.
 * Menggunakan multer untuk upload file (field 'image').
 */
exports.addPPDBBrosur = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Gambar brosur wajib diupload." });
    }
    const imageUrl = '/public/uploads/' + req.file.filename;
    const newBrosur = await PPDBBrosur.create({ imageUrl });
    res.status(201).json({ message: "PPDB Brosur berhasil ditambahkan", brosur: newBrosur });
  } catch (error) {
    console.error("Error adding PPDB Brosur:", error);
    res.status(500).json({ message: "Error adding PPDB Brosur", error: error.message });
  }
};

/**
 * PUT /api/ppdbbrosur/:id
 * Memperbarui data PPDB Brosur berdasarkan ID.
 * Jika ada file baru diupload, gambar lama akan dihapus.
 */
exports.updatePPDBBrosur = async (req, res) => {
  try {
    const { id } = req.params;
    const brosur = await PPDBBrosur.findByPk(id);
    if (!brosur) {
      return res.status(404).json({ message: "PPDB Brosur tidak ditemukan" });
    }
    if (req.file) {
      if (brosur.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', brosur.imageUrl.substring(1));
        fs.unlink(oldFilePath, err => {
          if (err) console.error("Error deleting old brosur image:", err);
        });
      }
      brosur.imageUrl = '/public/uploads/' + req.file.filename;
    }
    await brosur.save();
    res.json({ message: "PPDB Brosur berhasil diperbarui", brosur });
  } catch (error) {
    console.error("Error updating PPDB Brosur:", error);
    res.status(500).json({ message: "Error updating PPDB Brosur", error: error.message });
  }
};

/**
 * DELETE /api/ppdbbrosur/:id
 * Menghapus data PPDB Brosur berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deletePPDBBrosur = async (req, res) => {
  try {
    const { id } = req.params;
    const brosur = await PPDBBrosur.findByPk(id);
    if (!brosur) {
      return res.status(404).json({ message: "PPDB Brosur tidak ditemukan" });
    }
    if (brosur.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', brosur.imageUrl.substring(1));
      fs.unlink(filePath, err => {
        if (err) console.error("Error deleting brosur image:", err);
      });
    }
    await brosur.destroy();
    res.json({ message: "PPDB Brosur berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PPDB Brosur:", error);
    res.status(500).json({ message: "Error deleting PPDB Brosur", error: error.message });
  }
};
