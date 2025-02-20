// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Contoh: 'mycloudname'
  api_key: process.env.CLOUDINARY_API_KEY,       // Contoh: '123456789'
  api_secret: process.env.CLOUDINARY_API_SECRET, // Contoh: 'abcdefg'
  secure:true
});

module.exports = cloudinary;
