// routes/dataSekolahRoutes.js

const express = require('express');
const router = express.Router();
const dataSekolahController = require('../controllers/dataSekolahController');

// GET /api/data-sekolah - Mengambil data sekolah
router.get('/', dataSekolahController.getDataSekolah);

// POST /api/data-sekolah - Menambahkan data sekolah baru
router.post('/', dataSekolahController.addDataSekolah);

// PUT /api/data-sekolah/:id - Memperbarui data sekolah berdasarkan ID
router.put('/:id', dataSekolahController.updateDataSekolah);

// DELETE /api/data-sekolah/:id - Menghapus data sekolah berdasarkan ID
router.delete('/:id', dataSekolahController.deleteDataSekolah);

module.exports = router;
