const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller untuk prestasi
const prestasiController = require('../controllers/prestasiController');

// GET /api/prestasi - Mengambil semua data prestasi (diurutkan berdasarkan createdAt secara descending)
router.get('/', prestasiController.getAllPrestasi);

// POST /api/prestasi - Menambahkan data prestasi baru dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), prestasiController.addPrestasi);

// PUT /api/prestasi/:id - Memperbarui data prestasi berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), prestasiController.updatePrestasi);

// DELETE /api/prestasi/:id - Menghapus data prestasi berdasarkan ID
router.delete('/:id', prestasiController.deletePrestasi);

module.exports = router;
