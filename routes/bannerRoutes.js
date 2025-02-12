// routes/bannerRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bannerController = require('../controllers/bannerController');

// Konfigurasi Multer untuk file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Pastikan folder 'public/uploads/' sudah ada dan dapat diakses
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Buat nama file unik menggunakan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Endpoint untuk mendapatkan semua banner
router.get('/', bannerController.getAllBanners);

// Endpoint untuk menambahkan banner baru
// Gunakan upload.single('image') untuk menangani file upload dengan field name "image"
router.post('/', upload.single('image'), bannerController.addBanner);

// Endpoint untuk memperbarui banner yang sudah ada
router.put('/:id', upload.single('image'), bannerController.updateBanner);

// Endpoint untuk menghapus banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
