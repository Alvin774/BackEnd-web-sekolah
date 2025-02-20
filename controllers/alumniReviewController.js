const AlumniReview = require('../models/AlumniReview');
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
 * Jika ada file yang diupload (field 'image'), upload ke Cloudinary dan simpan URL serta public_id-nya.
 */
exports.addAlumniReview = async (req, res) => {
  try {
    const { review, alumniName, alumniYear } = req.body;
    if (!review || !alumniName || !alumniYear) {
      return res.status(400).json({ message: "Review, alumni name, and alumni year are required." });
    }
    
    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, 'alumniReviews');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    
    const newReview = await AlumniReview.create({
      review,
      alumniName,
      alumniYear,
      imageUrl,
      imagePublicId
    });
    res.status(201).json({ message: "Alumni review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding alumni review:", error);
    res.status(500).json({ message: "Error adding alumni review", error: error.message });
  }
};

/**
 * PUT /api/alumniReviews/:id
 * Memperbarui alumni review berdasarkan ID.
 * Jika ada file baru diupload, upload ke Cloudinary dan hapus gambar lama (jika ada).
 */
exports.updateAlumniReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, alumniName, alumniYear } = req.body;
    const alumniReview = await AlumniReview.findByPk(id);
    
    if (!alumniReview) {
      return res.status(404).json({ message: "Alumni review not found" });
    }
    
    if (req.file) {
      // Jika ada imagePublicId sebelumnya, hapus gambar lama dari Cloudinary
      if (alumniReview.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(alumniReview.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'alumniReviews');
      alumniReview.imageUrl = result.secure_url;
      alumniReview.imagePublicId = result.public_id;
    }
    
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
 * Menghapus alumni review berdasarkan ID, dan menghapus gambar dari Cloudinary jika ada.
 */
exports.deleteAlumniReview = async (req, res) => {
  try {
    const { id } = req.params;
    const alumniReview = await AlumniReview.findByPk(id);
    if (!alumniReview) {
      return res.status(404).json({ message: "Alumni review not found" });
    }
    
    if (alumniReview.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(alumniReview.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    
    await alumniReview.destroy();
    res.json({ message: "Alumni review deleted successfully" });
  } catch (error) {
    console.error("Error deleting alumni review:", error);
    res.status(500).json({ message: "Error deleting alumni review", error: error.message });
  }
};
