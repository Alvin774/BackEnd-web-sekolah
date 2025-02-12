// routes/alumniReviewRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const alumniReviewController = require('../controllers/alumniReviewController');

// Konfigurasi Multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' ada
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Endpoint GET untuk mengambil semua alumni reviews
router.get('/', alumniReviewController.getAllAlumniReviews);

// Endpoint POST untuk menambahkan alumni review baru (dengan dukungan file upload)
router.post('/', upload.single('image'), alumniReviewController.addAlumniReview);

// Endpoint PUT untuk memperbarui alumni review berdasarkan ID
router.put('/:id', upload.single('image'), alumniReviewController.updateAlumniReview);

// Endpoint DELETE untuk menghapus alumni review berdasarkan ID
router.delete('/:id', alumniReviewController.deleteAlumniReview);

module.exports = router;
