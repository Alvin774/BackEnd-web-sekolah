const Prestasi = require('../models/Prestasi');
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
 * GET /api/prestasi
 * Ambil semua data prestasi, diurutkan berdasarkan createdAt (terbaru dulu)
 */
exports.getAllPrestasi = async (req, res) => {
  try {
    const prestasiList = await Prestasi.findAll({ order: [['createdAt', 'DESC']] });
    res.json(prestasiList);
  } catch (error) {
    console.error("Error retrieving prestasi:", error);
    res.status(500).json({ message: "Error retrieving prestasi", error: error.message });
  }
};

/**
 * POST /api/prestasi
 * Tambah data prestasi baru (dengan upload gambar ke Cloudinary)
 */
exports.addPrestasi = async (req, res) => {
  try {
    const { title, pringkat, description } = req.body;
    if (!title || !pringkat || !description) {
      return res.status(400).json({ message: "Semua field (title, pringkat, description) wajib diisi." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Gambar wajib diupload." });
    }
    // Upload gambar ke Cloudinary pada folder 'prestasi'
    const result = await uploadFromBuffer(req.file.buffer, 'prestasi');
    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;
    
    const newPrestasi = await Prestasi.create({
      title,
      pringkat,
      description,
      imageUrl,
      imagePublicId
    });
    res.status(201).json({ message: "Prestasi berhasil ditambahkan", prestasi: newPrestasi });
  } catch (error) {
    console.error("Error adding prestasi:", error);
    res.status(500).json({ message: "Error adding prestasi", error: error.message });
  }
};

/**
 * PUT /api/prestasi/:id
 * Update data prestasi berdasarkan ID.
 * Jika ada file baru yang diupload, gambar lama dihapus dari Cloudinary dan diganti dengan yang baru.
 */
exports.updatePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pringkat, description } = req.body;
    const prestasi = await Prestasi.findByPk(id);
    if (!prestasi) {
      return res.status(404).json({ message: "Prestasi tidak ditemukan" });
    }
    
    if (req.file) {
      // Jika ada file baru diupload, hapus gambar lama dari Cloudinary jika ada
      if (prestasi.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(prestasi.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'prestasi');
      prestasi.imageUrl = result.secure_url;
      prestasi.imagePublicId = result.public_id;
    }
    
    prestasi.title = title || prestasi.title;
    prestasi.pringkat = pringkat || prestasi.pringkat;
    prestasi.description = description || prestasi.description;
    
    await prestasi.save();
    res.json({ message: "Prestasi berhasil diperbarui", prestasi });
  } catch (error) {
    console.error("Error updating prestasi:", error);
    res.status(500).json({ message: "Error updating prestasi", error: error.message });
  }
};

/**
 * DELETE /api/prestasi/:id
 * Hapus data prestasi berdasarkan ID, serta hapus gambar dari Cloudinary jika ada.
 */
exports.deletePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const prestasi = await Prestasi.findByPk(id);
    if (!prestasi) {
      return res.status(404).json({ message: "Prestasi tidak ditemukan" });
    }
    if (prestasi.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(prestasi.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    await prestasi.destroy();
    res.json({ message: "Prestasi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting prestasi:", error);
    res.status(500).json({ message: "Error deleting prestasi", error: error.message });
  }
};
