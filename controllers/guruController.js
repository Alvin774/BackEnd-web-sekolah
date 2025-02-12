// controllers/guruController.js

const Guru = require('../models/Guru');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/guru
 * Mengambil semua data guru.
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
 * Mendukung file upload untuk foto guru (field 'image').
 */
exports.addGuru = async (req, res) => {
  try {
    const { name, nip } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const guru = await Guru.create({ name, nip, imageUrl });
    res.status(201).json({ message: "Guru added successfully", guru });
  } catch (error) {
    console.error("Error adding guru:", error);
    res.status(500).json({ message: "Error adding guru", error: error.message });
  }
};

/**
 * PUT /api/guru/:id
 * Memperbarui data guru berdasarkan ID.
 * Jika ada file baru diupload, file foto lama akan dihapus.
 */
exports.updateGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nip } = req.body;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru not found" });
    }
    // Jika ada file baru diupload, hapus file lama jika ada
    if (req.file) {
      if (guru.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', guru.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      guru.imageUrl = '/public/uploads/' + req.file.filename;
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
 * Menghapus data guru berdasarkan ID, serta menghapus file foto terkait jika ada.
 */
exports.deleteGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru not found" });
    }
    if (guru.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'public', guru.imageUrl.substring(1));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }
    await guru.destroy();
    res.json({ message: "Guru deleted successfully" });
  } catch (error) {
    console.error("Error deleting guru:", error);
    res.status(500).json({ message: "Error deleting guru", error: error.message });
  }
};
