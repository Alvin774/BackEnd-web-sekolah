// routes/fasilitasRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fasilitasController = require('../controllers/fasilitasController');

// Konfigurasi Multer untuk file upload (untuk field 'image')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' sudah ada dan dapat diakses
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET /api/fasilitas - Mengambil semua data fasilitas
router.get('/', fasilitasController.getAllFasilitas);

// POST /api/fasilitas - Menambahkan fasilitas baru (dengan upload file)
router.post('/', upload.single('image'), fasilitasController.addFasilitas);

// PUT /api/fasilitas/:id - Memperbarui data fasilitas berdasarkan ID (dengan upload file jika ada)
router.put('/:id', upload.single('image'), fasilitasController.updateFasilitas);

// DELETE /api/fasilitas/:id - Menghapus data fasilitas berdasarkan ID
router.delete('/:id', fasilitasController.deleteFasilitas);

module.exports = router;
