// controllers/prestasiController.js

const Prestasi = require('../models/Prestasi');
const fs = require('fs');
const path = require('path');

// GET /api/prestasi - Ambil semua data prestasi, diurutkan berdasarkan createdAt (terbaru dulu)
exports.getAllPrestasi = async (req, res) => {
  try {
    const prestasiList = await Prestasi.findAll({ order: [['createdAt', 'DESC']] });
    res.json(prestasiList);
  } catch (error) {
    console.error("Error retrieving prestasi:", error);
    res.status(500).json({ message: "Error retrieving prestasi", error: error.message });
  }
};

// POST /api/prestasi - Tambah data prestasi baru (dengan upload gambar)
exports.addPrestasi = async (req, res) => {
  try {
    const { title, pringkat, description } = req.body;
    if (!title || !pringkat || !description) {
      return res.status(400).json({ message: "Semua field (title, pringkat, description) wajib diisi." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Gambar wajib diupload." });
    }
    const imageUrl = '/public/uploads/' + req.file.filename;
    const newPrestasi = await Prestasi.create({
      title,
      pringkat,
      description,
      imageUrl
    });
    res.status(201).json({ message: "Prestasi berhasil ditambahkan", prestasi: newPrestasi });
  } catch (error) {
    console.error("Error adding prestasi:", error);
    res.status(500).json({ message: "Error adding prestasi", error: error.message });
  }
};

// PUT /api/prestasi/:id - Update data prestasi berdasarkan ID (jika ada gambar baru, hapus gambar lama)
exports.updatePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pringkat, description } = req.body;
    const prestasi = await Prestasi.findByPk(id);
    if (!prestasi) {
      return res.status(404).json({ message: "Prestasi tidak ditemukan" });
    }
    // Jika ada file baru diupload, hapus file gambar lama (jika ada)
    if (req.file) {
      if (prestasi.imageUrl) {
        const oldPath = path.join(__dirname, '..', 'public', prestasi.imageUrl.substring(1));
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      prestasi.imageUrl = '/public/uploads/' + req.file.filename;
    }
    prestasi.title = title !== undefined ? title : prestasi.title;
    prestasi.pringkat = pringkat !== undefined ? pringkat : prestasi.pringkat;
    prestasi.description = description !== undefined ? description : prestasi.description;
    await prestasi.save();
    res.json({ message: "Prestasi berhasil diperbarui", prestasi });
  } catch (error) {
    console.error("Error updating prestasi:", error);
    res.status(500).json({ message: "Error updating prestasi", error: error.message });
  }
};

// DELETE /api/prestasi/:id - Hapus data prestasi berdasarkan ID (serta hapus file gambarnya jika ada)
exports.deletePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const prestasi = await Prestasi.findByPk(id);
    if (!prestasi) {
      return res.status(404).json({ message: "Prestasi tidak ditemukan" });
    }
    if (prestasi.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', prestasi.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }
    await prestasi.destroy();
    res.json({ message: "Prestasi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting prestasi:", error);
    res.status(500).json({ message: "Error deleting prestasi", error: error.message });
  }
};
