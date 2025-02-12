// routes/ppdbCarouselRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ppdbCarouselController = require('../controllers/ppdbCarouselController');

// Konfigurasi Multer untuk file upload (field 'image')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' sudah ada
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET /api/ppdbcarousel - Mengambil semua data carousel
router.get('/', ppdbCarouselController.getAllCarousel);

// POST /api/ppdbcarousel - Menambahkan data carousel baru
router.post('/', upload.single('image'), ppdbCarouselController.addCarousel);

// PUT /api/ppdbcarousel/:id - Memperbarui data carousel berdasarkan ID
router.put('/:id', upload.single('image'), ppdbCarouselController.updateCarousel);

// DELETE /api/ppdbcarousel/:id - Menghapus data carousel berdasarkan ID
router.delete('/:id', ppdbCarouselController.deleteCarousel);

module.exports = router;
