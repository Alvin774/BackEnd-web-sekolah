const Extracurricular = require('../models/Extracurricular');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Helper function: Upload file buffer ke Cloudinary
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
 * Mendukung upload file untuk field 'image' ke Cloudinary.
 */
exports.addExtracurricular = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nama ekstrakurikuler wajib diisi" });
    }
    
    let imageUrl = null;
    let imagePublicId = null;
    
    if (req.file) {
      // Upload file ke Cloudinary di folder 'extracurricular'
      const result = await uploadFromBuffer(req.file.buffer, 'extracurricular');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    
    const newActivity = await Extracurricular.create({
      name,
      description,
      imageUrl,
      imagePublicId,
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
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary.
 */
exports.updateExtracurricular = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const activity = await Extracurricular.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Data ekstrakurikuler tidak ditemukan" });
    }
    
    if (req.file) {
      // Jika ada file baru, hapus gambar lama dari Cloudinary jika ada
      if (activity.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(activity.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'extracurricular');
      activity.imageUrl = result.secure_url;
      activity.imagePublicId = result.public_id;
    }
    
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
 * Menghapus data ekstrakurikuler berdasarkan ID, serta menghapus gambar dari Cloudinary jika ada.
 */
exports.deleteExtracurricular = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Extracurricular.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Data ekstrakurikuler tidak ditemukan" });
    }
    
    if (activity.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(activity.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    
    await activity.destroy();
    res.json({ message: "Data ekstrakurikuler berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting extracurricular:", error);
    res.status(500).json({ message: "Error deleting extracurricular", error: error.message });
  }
};
