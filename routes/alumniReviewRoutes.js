const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan sebagai buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller
const alumniReviewController = require('../controllers/alumniReviewController');

// GET: Ambil semua alumni review
router.get('/', alumniReviewController.getAllAlumniReviews);

// POST: Tambah alumni review baru, dengan opsi upload gambar
router.post('/', upload.single('image'), alumniReviewController.addAlumniReview);

// PUT: Perbarui alumni review berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), alumniReviewController.updateAlumniReview);

// DELETE: Hapus alumni review berdasarkan ID
router.delete('/:id', alumniReviewController.deleteAlumniReview);

module.exports = router;
