// controllers/fasilitasController.js

const Fasilitas = require('../models/Fasilitas');
const fs = require('fs');
const path = require('path');

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
 * Mendukung upload file untuk gambar fasilitas (field 'image').
 */
exports.addFasilitas = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = null;

    if (!name) {
      return res.status(400).json({ message: "Nama fasilitas wajib diisi" });
    }

    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    } else {
      return res.status(400).json({ message: "Gambar fasilitas wajib diupload" });
    }

    const newFasilitas = await Fasilitas.create({
      name,
      imageUrl
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
 * Jika ada file baru diupload, file gambar lama akan dihapus (jika ada).
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
      // Hapus gambar lama jika ada
      if (fasilitas.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', fasilitas.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      fasilitas.imageUrl = '/public/uploads/' + req.file.filename;
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
 * Menghapus data fasilitas berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deleteFasilitas = async (req, res) => {
  try {
    const { id } = req.params;
    const fasilitas = await Fasilitas.findByPk(id);
    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }
    if (fasilitas.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', fasilitas.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });
    }
    await fasilitas.destroy();
    res.json({ message: "Fasilitas berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting fasilitas:", error);
    res.status(500).json({ message: "Error deleting fasilitas", error: error.message });
  }
};
