const express = require('express');
const router = express.Router();
const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file dalam buffer agar dapat langsung diupload ke Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller PPDB Carousel
const ppdbCarouselController = require('../controllers/ppdbCarouselController');

// GET: Ambil semua data carousel
router.get('/', ppdbCarouselController.getAllCarousel);

// POST: Tambah data carousel baru dengan opsi upload gambar (field 'image')
router.post('/', upload.single('image'), ppdbCarouselController.addCarousel);

// PUT: Perbarui data carousel berdasarkan ID dengan opsi upload gambar baru
router.put('/:id', upload.single('image'), ppdbCarouselController.updateCarousel);

// DELETE: Hapus data carousel berdasarkan ID
router.delete('/:id', ppdbCarouselController.deleteCarousel);

module.exports = router;
