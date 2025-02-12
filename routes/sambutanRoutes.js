// routes/sambutanRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sambutanController = require('../controllers/sambutanController');

// Konfigurasi Multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' ada dan dapat diakses
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET sambutan
router.get('/', sambutanController.getSambutan);

// POST sambutan (menambahkan sambutan baru)
router.post('/', upload.single('image'), sambutanController.addSambutan);

// PUT sambutan (memperbarui sambutan berdasarkan ID)
router.put('/:id', upload.single('image'), sambutanController.updateSambutan);

// DELETE sambutan (menghapus sambutan berdasarkan ID)
router.delete('/:id', sambutanController.deleteSambutan);

module.exports = router;
