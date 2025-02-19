const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file dalam buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller prestasi
const prestasiController = require('../controllers/prestasiController');

// GET: Ambil semua data prestasi
router.get('/', prestasiController.getAllPrestasi);

// POST: Tambah data prestasi baru dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), prestasiController.addPrestasi);

// PUT: Perbarui data prestasi berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), prestasiController.updatePrestasi);

// DELETE: Hapus data prestasi berdasarkan ID
router.delete('/:id', prestasiController.deletePrestasi);

module.exports = router;
