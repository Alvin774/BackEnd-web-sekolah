// routes/newsRoutes.js

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Pastikan folder 'public/uploads/' sudah ada dan memiliki izin tulis
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Buat nama file unik dengan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk mengambil semua berita
router.get('/', newsController.getAllNews);

// Endpoint untuk menambahkan berita baru
// Gunakan upload.single('image') untuk menangani file upload dengan field name "image"
router.post('/', upload.single('image'), newsController.addNews);

// Endpoint untuk menghapus berita berdasarkan ID
router.delete('/:id', newsController.deleteNews);

// Endpoint untuk memperbarui berita (update)
// Jika ada file baru yang diupload, gambar lama akan diganti
router.put('/:id', upload.single('image'), newsController.updateNews);

module.exports = router;
