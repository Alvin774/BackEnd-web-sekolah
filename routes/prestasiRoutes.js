// routes/prestasiRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prestasiController = require('../controllers/prestasiController');

// Konfigurasi multer untuk menangani file upload pada field 'image'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads' sudah ada
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', prestasiController.getAllPrestasi);
router.post('/', upload.single('image'), prestasiController.addPrestasi);
router.put('/:id', upload.single('image'), prestasiController.updatePrestasi);
router.delete('/:id', prestasiController.deletePrestasi);

module.exports = router;
