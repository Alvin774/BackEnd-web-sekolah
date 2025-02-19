const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file dalam buffer agar bisa langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller fasilitas
const fasilitasController = require('../controllers/fasilitasController');

// GET: Ambil semua data fasilitas
router.get('/', fasilitasController.getAllFasilitas);

// POST: Tambah data fasilitas baru dengan opsi upload gambar
router.post('/', upload.single('image'), fasilitasController.addFasilitas);

// PUT: Perbarui data fasilitas berdasarkan ID dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), fasilitasController.updateFasilitas);

// DELETE: Hapus data fasilitas berdasarkan ID
router.delete('/:id', fasilitasController.deleteFasilitas);

module.exports = router;
