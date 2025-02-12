// routes/extracurricularRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const extracurricularController = require('../controllers/extracurricularController');

// Konfigurasi Multer untuk file upload (untuk field image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'public/uploads/' ada dan dapat diakses
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET /api/extracurriculars - Mengambil semua data ekstrakurikuler
router.get('/', extracurricularController.getAllExtracurriculars);

// POST /api/extracurriculars - Menambahkan data ekstrakurikuler baru (dengan dukungan upload file)
router.post('/', upload.single('image'), extracurricularController.addExtracurricular);

// PUT /api/extracurriculars/:id - Memperbarui data ekstrakurikuler berdasarkan ID (dengan dukungan upload file)
router.put('/:id', upload.single('image'), extracurricularController.updateExtracurricular);

// DELETE /api/extracurriculars/:id - Menghapus data ekstrakurikuler berdasarkan ID
router.delete('/:id', extracurricularController.deleteExtracurricular);

module.exports = router;
