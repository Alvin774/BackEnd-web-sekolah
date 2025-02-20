const express = require('express');
const router = express.Router();
const sejarahController = require('../controllers/sejarahController');

// GET: Ambil sejarah terkini
router.get('/', sejarahController.getSejarah);

// POST: Tambah data sejarah baru
router.post('/', sejarahController.addSejarah);

// PUT: Perbarui data sejarah berdasarkan ID
router.put('/:id', sejarahController.updateSejarah);

// DELETE: Hapus data sejarah berdasarkan ID
router.delete('/:id', sejarahController.deleteSejarah);

module.exports = router;
