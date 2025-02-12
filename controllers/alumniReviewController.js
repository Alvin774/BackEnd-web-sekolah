// controllers/alumniReviewController.js

const AlumniReview = require('../models/AlumniReview');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/alumniReviews
 * Mengambil semua data alumni review, diurutkan berdasarkan waktu dibuat (terbaru pertama)
 */
exports.getAllAlumniReviews = async (req, res) => {
  try {
    const reviews = await AlumniReview.findAll({ order: [['createdAt', 'DESC']] });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching alumni reviews:", error);
    res.status(500).json({ message: "Error fetching alumni reviews", error: error.message });
  }
};

/**
 * POST /api/alumniReviews
 * Menambahkan alumni review baru.
 * Jika ada file diupload (field 'image'), simpan path-nya.
 */
exports.addAlumniReview = async (req, res) => {
  try {
    const { review, alumniName, alumniYear } = req.body;
    let imageUrl = null;
    
    // Jika ada file yang diupload, gunakan file tersebut
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    // Validasi: Pastikan review, alumniName, dan alumniYear diisi
    if (!review || !alumniName || !alumniYear) {
      return res.status(400).json({ message: "Review, alumni name, and alumni year are required." });
    }
    
    const newReview = await AlumniReview.create({ review, alumniName, alumniYear, imageUrl });
    res.status(201).json({ message: "Alumni review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding alumni review:", error);
    res.status(500).json({ message: "Error adding alumni review", error: error.message });
  }
};

/**
 * PUT /api/alumniReviews/:id
 * Memperbarui alumni review berdasarkan ID.
 * Jika ada file baru diupload, file lama (jika ada) akan dihapus.
 */
exports.updateAlumniReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, alumniName, alumniYear } = req.body;
    const alumniReview = await AlumniReview.findByPk(id);
    
    if (!alumniReview) {
      return res.status(404).json({ message: "Alumni review not found" });
    }
    
    // Jika ada file baru diupload, hapus file lama (jika ada)
    if (req.file) {
      if (alumniReview.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', alumniReview.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      alumniReview.imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    // Perbarui field lainnya
    alumniReview.review = review !== undefined ? review : alumniReview.review;
    alumniReview.alumniName = alumniName !== undefined ? alumniName : alumniReview.alumniName;
    alumniReview.alumniYear = alumniYear !== undefined ? alumniYear : alumniReview.alumniYear;
    
    await alumniReview.save();
    res.json({ message: "Alumni review updated successfully", review: alumniReview });
  } catch (error) {
    console.error("Error updating alumni review:", error);
    res.status(500).json({ message: "Error updating alumni review", error: error.message });
  }
};

/**
 * DELETE /api/alumniReviews/:id
 * Menghapus alumni review berdasarkan ID, dan menghapus file gambar terkait jika ada.
 */
exports.deleteAlumniReview = async (req, res) => {
  try {
    const { id } = req.params;
    const alumniReview = await AlumniReview.findByPk(id);
    if (!alumniReview) {
      return res.status(404).json({ message: "Alumni review not found" });
    }
    
    // Jika ada gambar, hapus file-nya dari disk
    if (alumniReview.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', alumniReview.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });
    }
    
    await alumniReview.destroy();
    res.json({ message: "Alumni review deleted successfully" });
  } catch (error) {
    console.error("Error deleting alumni review:", error);
    res.status(500).json({ message: "Error deleting alumni review", error: error.message });
  }
};
