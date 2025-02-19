const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', upload.single('file'), uploadController.uploadImage);

module.exports = router;
