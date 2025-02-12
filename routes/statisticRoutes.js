// routes/statisticRoutes.js

const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');

// GET /api/statistics - Mengambil data statistik
router.get('/', statisticController.getStatistics);

// PUT /api/statistics - Memperbarui data statistik
router.put('/', statisticController.updateStatistics);

module.exports = router;
