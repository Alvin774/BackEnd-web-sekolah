const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage agar file tersimpan dalam buffer untuk diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller banner
const bannerController = require('../controllers/bannerController');

// GET: Ambil semua banner
router.get('/', bannerController.getAllBanners);

// POST: Tambah banner baru, dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), bannerController.addBanner);

// PUT: Perbarui banner berdasarkan ID, dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), bannerController.updateBanner);

// DELETE: Hapus banner berdasarkan ID
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
