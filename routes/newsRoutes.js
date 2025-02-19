const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller News
const newsController = require('../controllers/newsController');

// GET: Mengambil semua berita
router.get('/', newsController.getAllNews);

// POST: Menambahkan berita baru dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), newsController.addNews);

// PUT: Memperbarui berita berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), newsController.updateNews);

// DELETE: Menghapus berita berdasarkan ID
router.delete('/:id', newsController.deleteNews);

module.exports = router;
