// routes/ppdbBrosurRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ppdbBrosurController = require('../controllers/ppdbBrosurController');

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

// GET semua data PPDB Brosur
router.get('/', ppdbBrosurController.getAllPPDBBrosur);

// POST menambahkan brosur baru (dengan upload file)
router.post('/', upload.single('image'), ppdbBrosurController.addPPDBBrosur);

// PUT memperbarui brosur berdasarkan ID (dengan upload file jika ada)
router.put('/:id', upload.single('image'), ppdbBrosurController.updatePPDBBrosur);

// DELETE menghapus brosur berdasarkan ID
router.delete('/:id', ppdbBrosurController.deletePPDBBrosur);

module.exports = router;
