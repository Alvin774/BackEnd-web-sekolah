const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller alur pendaftaran
const alurPendaftaranController = require('../controllers/alurPendaftaranController');

// GET: Ambil semua data alur pendaftaran (diurutkan berdasarkan stepNumber ascending)
router.get('/', alurPendaftaranController.getAllAlurPendaftaran);

// POST: Tambah data alur pendaftaran baru, dengan opsi upload gambar
router.post('/', upload.single('image'), alurPendaftaranController.addAlurPendaftaran);

// PUT: Perbarui data alur pendaftaran berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), alurPendaftaranController.updateAlurPendaftaran);

// DELETE: Hapus data alur pendaftaran berdasarkan ID
router.delete('/:id', alurPendaftaranController.deleteAlurPendaftaran);

module.exports = router;
