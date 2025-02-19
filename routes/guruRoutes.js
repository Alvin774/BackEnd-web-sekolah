const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file dalam buffer agar file bisa langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller guru
const guruController = require('../controllers/guruController');

// GET: Ambil semua data guru
router.get('/', guruController.getAllGuru);

// POST: Tambah data guru baru, dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), guruController.addGuru);

// PUT: Perbarui data guru berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), guruController.updateGuru);

// DELETE: Hapus data guru berdasarkan ID
router.delete('/:id', guruController.deleteGuru);

module.exports = router;
