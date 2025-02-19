// controllers/uploadController.js
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Upload file buffer ke Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "your_folder_name" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: 'Upload error', error: error.message });
        }
        // Hasil upload berisi URL gambar yang bisa disimpan di database
        res.json({ message: 'Upload berhasil', imageUrl: result.secure_url });
      }
    );
    // Pipe file buffer ke stream
    req.file.stream.pipe(result);
  } catch (error) {
    console.error("Error in uploadImage:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
