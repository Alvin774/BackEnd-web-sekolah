// routes/guruRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const guruController = require('../controllers/guruController');

// Konfigurasi Multer untuk menangani file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' ada dan memiliki izin tulis
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET /api/guru - Mengambil semua data guru
router.get('/', guruController.getAllGuru);

// POST /api/guru - Menambahkan guru baru (dengan dukungan file upload untuk foto)
router.post('/', upload.single('image'), guruController.addGuru);

// PUT /api/guru/:id - Memperbarui data guru berdasarkan ID
router.put('/:id', upload.single('image'), guruController.updateGuru);

// DELETE /api/guru/:id - Menghapus guru berdasarkan ID
router.delete('/:id', guruController.deleteGuru);

module.exports = router;
