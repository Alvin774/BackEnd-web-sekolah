const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Untuk mendaftarkan user baru
router.post('/register', authController.register);

// POST /api/auth/login - Untuk login user
router.post('/login', authController.login);

module.exports = router;
