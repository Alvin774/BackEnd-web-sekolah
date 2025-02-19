// routes/strukturOrganisasiRoutes.js

const express = require('express');
const router = express.Router();
const strukturOrganisasiController = require('../controllers/strukturOrganisasiController');

// GET semua data struktur organisasi
router.get('/', strukturOrganisasiController.getAllStrukturOrganisasi);

// POST menambahkan data struktur organisasi baru
router.post('/', strukturOrganisasiController.addStrukturOrganisasi);

// PUT memperbarui data struktur organisasi berdasarkan ID
router.put('/:id', strukturOrganisasiController.updateStrukturOrganisasi);

// DELETE menghapus data struktur organisasi berdasarkan ID
router.delete('/:id', strukturOrganisasiController.deleteStrukturOrganisasi);

module.exports = router;
