const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller PPDB Brosur
const ppdbBrosurController = require('../controllers/ppdbBrosurController');

// GET: Mengambil semua data PPDB Brosur
router.get('/', ppdbBrosurController.getAllPPDBBrosur);

// POST: Menambahkan data PPDB Brosur baru dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), ppdbBrosurController.addPPDBBrosur);

// PUT: Memperbarui data PPDB Brosur berdasarkan ID dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), ppdbBrosurController.updatePPDBBrosur);

// DELETE: Menghapus data PPDB Brosur berdasarkan ID
router.delete('/:id', ppdbBrosurController.deletePPDBBrosur);

module.exports = router;
