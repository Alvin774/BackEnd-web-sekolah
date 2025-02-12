// routes/alurPendaftaranRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const alurPendaftaranController = require('../controllers/alurPendaftaranController');

// Konfigurasi Multer untuk file upload (field 'image')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' sudah ada
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Nama file unik dengan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET semua data alur pendaftaran (diurutkan berdasarkan stepNumber)
router.get('/', alurPendaftaranController.getAllAlurPendaftaran);

// POST menambahkan data alur pendaftaran baru (dengan upload file)
router.post('/', upload.single('image'), alurPendaftaranController.addAlurPendaftaran);

// PUT memperbarui data alur pendaftaran berdasarkan ID (dengan upload file jika ada)
router.put('/:id', upload.single('image'), alurPendaftaranController.updateAlurPendaftaran);

// DELETE menghapus data alur pendaftaran berdasarkan ID
router.delete('/:id', alurPendaftaranController.deleteAlurPendaftaran);

module.exports = router;
