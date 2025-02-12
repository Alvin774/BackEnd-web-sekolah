// controllers/extracurricularController.js

const Extracurricular = require('../models/Extracurricular');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/extracurriculars
 * Mengambil semua data ekstrakurikuler.
 */
exports.getAllExtracurriculars = async (req, res) => {
  try {
    const activities = await Extracurricular.findAll({ order: [['createdAt', 'DESC']] });
    res.json(activities);
  } catch (error) {
    console.error("Error fetching extracurriculars:", error);
    res.status(500).json({ message: "Error fetching extracurriculars", error: error.message });
  }
};

/**
 * POST /api/extracurriculars
 * Menambahkan data ekstrakurikuler baru.
 * Mendukung upload file untuk field image (dengan nama field 'image').
 */
exports.addExtracurricular = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageUrl = null;
    
    // Validasi wajib: nama ekstrakurikuler
    if (!name) {
      return res.status(400).json({ message: "Nama ekstrakurikuler wajib diisi" });
    }
    
    // Jika ada file yang diupload, simpan path-nya
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    const newActivity = await Extracurricular.create({
      name,
      imageUrl,
      description
    });
    
    res.status(201).json({ message: "Data ekstrakurikuler berhasil ditambahkan", extracurricular: newActivity });
  } catch (error) {
    console.error("Error adding extracurricular:", error);
    res.status(500).json({ message: "Error adding extracurricular", error: error.message });
  }
};

/**
 * PUT /api/extracurriculars/:id
 * Memperbarui data ekstrakurikuler berdasarkan ID.
 * Jika ada file baru diupload, file gambar lama akan dihapus (jika ada).
 */
exports.updateExtracurricular = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const activity = await Extracurricular.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Data ekstrakurikuler tidak ditemukan" });
    }
    
    // Jika ada file baru, hapus file lama (jika ada) dan update imageUrl
    if (req.file) {
      if (activity.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', activity.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      activity.imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    // Update field lainnya
    activity.name = name !== undefined ? name : activity.name;
    activity.description = description !== undefined ? description : activity.description;
    
    await activity.save();
    res.json({ message: "Data ekstrakurikuler berhasil diperbarui", extracurricular: activity });
  } catch (error) {
    console.error("Error updating extracurricular:", error);
    res.status(500).json({ message: "Error updating extracurricular", error: error.message });
  }
};

/**
 * DELETE /api/extracurriculars/:id
 * Menghapus data ekstrakurikuler berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deleteExtracurricular = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Extracurricular.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Data ekstrakurikuler tidak ditemukan" });
    }
    
    // Jika ada file gambar, hapus file tersebut
    if (activity.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', activity.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });
    }
    
    await activity.destroy();
    res.json({ message: "Data ekstrakurikuler berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting extracurricular:", error);
    res.status(500).json({ message: "Error deleting extracurricular", error: error.message });
  }
};
