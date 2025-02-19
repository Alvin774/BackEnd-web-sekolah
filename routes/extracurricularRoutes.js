const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file dalam buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller
const extracurricularController = require('../controllers/extracurricularController');

// GET: Ambil semua data ekstrakurikuler
router.get('/', extracurricularController.getAllExtracurriculars);

// POST: Tambah data ekstrakurikuler baru dengan opsi upload gambar
router.post('/', upload.single('image'), extracurricularController.addExtracurricular);

// PUT: Perbarui data ekstrakurikuler berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), extracurricularController.updateExtracurricular);

// DELETE: Hapus data ekstrakurikuler berdasarkan ID
router.delete('/:id', extracurricularController.deleteExtracurricular);

module.exports = router;
