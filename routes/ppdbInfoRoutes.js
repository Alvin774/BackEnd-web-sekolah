// routes/ppdbInfoRoutes.js

const express = require('express');
const router = express.Router();
const ppdbInfoController = require('../controllers/ppdbInfoController');

// GET semua data PPDB Info
router.get('/', ppdbInfoController.getAllPPDBInfo);

// POST menambahkan data PPDB Info baru
router.post('/', ppdbInfoController.addPPDBInfo);

// PUT memperbarui data PPDB Info berdasarkan ID
router.put('/:id', ppdbInfoController.updatePPDBInfo);

// DELETE menghapus data PPDB Info berdasarkan ID
router.delete('/:id', ppdbInfoController.deletePPDBInfo);

module.exports = router;
