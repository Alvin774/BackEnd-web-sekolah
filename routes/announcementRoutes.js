// routes/announcementRoutes.js

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// GET semua pengumuman/agenda
router.get('/', announcementController.getAllAnnouncements);

// POST menambahkan pengumuman/agenda baru
router.post('/', announcementController.addAnnouncement);

// PUT memperbarui pengumuman/agenda berdasarkan ID
router.put('/:id', announcementController.updateAnnouncement);

// DELETE menghapus pengumuman/agenda berdasarkan ID
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
