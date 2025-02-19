const PPDBBrosur = require('../models/PPDBBrosur');
const cloudinary = require('../config/cloudinary');
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
 * Menggunakan multer untuk upload file (field 'image') ke Cloudinary.
 */
exports.addPPDBBrosur = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Gambar brosur wajib diupload." });
    }
    // Upload file ke Cloudinary pada folder 'ppdbbrosur'
    const result = await uploadFromBuffer(req.file.buffer, 'ppdbbrosur');
    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;
    
    const newBrosur = await PPDBBrosur.create({ imageUrl, imagePublicId });
    res.status(201).json({ message: "PPDB Brosur berhasil ditambahkan", brosur: newBrosur });
  } catch (error) {
    console.error("Error adding PPDB Brosur:", error);
    res.status(500).json({ message: "Error adding PPDB Brosur", error: error.message });
  }
};

/**
 * PUT /api/ppdbbrosur/:id
 * Memperbarui data PPDB Brosur berdasarkan ID.
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary dan diganti dengan yang baru.
 */
exports.updatePPDBBrosur = async (req, res) => {
  try {
    const { id } = req.params;
    const brosur = await PPDBBrosur.findByPk(id);
    if (!brosur) {
      return res.status(404).json({ message: "PPDB Brosur tidak ditemukan" });
    }
    
    if (req.file) {
      // Jika ada gambar lama, hapus dari Cloudinary
      if (brosur.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(brosur.imagePublicId);
          console.log("Old brosur image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old brosur image from Cloudinary:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'ppdbbrosur');
      brosur.imageUrl = result.secure_url;
      brosur.imagePublicId = result.public_id;
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
 * Menghapus data PPDB Brosur berdasarkan ID, serta menghapus gambar terkait dari Cloudinary jika ada.
 */
exports.deletePPDBBrosur = async (req, res) => {
  try {
    const { id } = req.params;
    const brosur = await PPDBBrosur.findByPk(id);
    if (!brosur) {
      return res.status(404).json({ message: "PPDB Brosur tidak ditemukan" });
    }
    
    if (brosur.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(brosur.imagePublicId);
        console.log("Brosur image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting brosur image from Cloudinary:", err);
      }
    }
    
    await brosur.destroy();
    res.json({ message: "PPDB Brosur berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PPDB Brosur:", error);
    res.status(500).json({ message: "Error deleting PPDB Brosur", error: error.message });
  }
};
