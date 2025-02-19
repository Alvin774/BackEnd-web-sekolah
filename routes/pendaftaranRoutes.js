const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');

// Ambil semua data pendaftaran
router.get('/', pendaftaranController.getAllPendaftaran);

// Ambil data pendaftaran berdasarkan ID
router.get('/:id', pendaftaranController.getPendaftaranById);

// Tambah data pendaftaran baru
router.post('/', pendaftaranController.addPendaftaran);

// Update data pendaftaran berdasarkan ID
router.put('/:id', pendaftaranController.updatePendaftaran);

// Hapus data pendaftaran berdasarkan ID
router.delete('/:id', pendaftaranController.deletePendaftaran);

module.exports = router;
