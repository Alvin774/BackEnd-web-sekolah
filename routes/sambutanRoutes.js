const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller sambutan
const sambutanController = require('../controllers/sambutanController');

// GET: Mengambil sambutan terkini
router.get('/', sambutanController.getSambutan);

// POST: Menambahkan sambutan baru (dengan opsi upload gambar)
router.post('/', upload.single('image'), sambutanController.addSambutan);

// PUT: Memperbarui sambutan berdasarkan ID (dengan opsi upload gambar baru)
router.put('/:id', upload.single('image'), sambutanController.updateSambutan);

// DELETE: Menghapus sambutan berdasarkan ID
router.delete('/:id', sambutanController.deleteSambutan);

module.exports = router;
