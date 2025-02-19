// controllers/bannerController.js

const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary'); // Pastikan konfigurasi Cloudinary sudah benar
const path = require('path');

// Helper: Fungsi untuk mengupload file buffer ke Cloudinary
const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

/**
 * GET /api/banner
 * Mengambil semua banner, diurutkan berdasarkan waktu dibuat (desc)
 */
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [['createdAt', 'DESC']] });
    res.json(banners);
  } catch (error) {
    console.error("Error retrieving banners:", error);
    res.status(500).json({ message: "Error retrieving banners", error: error.message });
  }
};

/**
 * POST /api/banner
 * Menambahkan banner baru.
 * Jika file diupload (field 'image'), upload ke Cloudinary dan simpan URL dan public_id-nya.
 */
exports.addBanner = async (req, res) => {
  try {
    const { linkUrl } = req.body;
    let imageUrl = null;
    let imagePublicId = null;
    
    if (req.file) {
      // Upload file ke Cloudinary di folder 'banner'
      const result = await uploadFromBuffer(req.file.buffer, 'banner');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: "Image URL is required" });
    }
    
    const banner = await Banner.create({ imageUrl, imagePublicId, linkUrl });
    res.status(201).json({ message: "Banner added successfully", banner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Error adding banner", error: error.message });
  }
};

/**
 * PUT /api/banner/:id
 * Memperbarui banner yang sudah ada.
 * Jika ada file baru diupload, gambar lama akan dihapus dari Cloudinary.
 */
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { linkUrl } = req.body;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    if (req.file) {
      // Hapus gambar lama dari Cloudinary jika ada
      if (banner.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(banner.imagePublicId);
          console.log("Old banner image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old banner image from Cloudinary:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'banner');
      banner.imageUrl = result.secure_url;
      banner.imagePublicId = result.public_id;
    }
    
    if (linkUrl !== undefined) {
      banner.linkUrl = linkUrl;
    }
    
    await banner.save();
    res.json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Error updating banner", error: error.message });
  }
};

/**
 * DELETE /api/banner/:id
 * Menghapus banner beserta file gambarnya dari Cloudinary (jika ada).
 */
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    if (banner.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(banner.imagePublicId);
        console.log("Banner image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting banner image from Cloudinary:", err);
      }
    }
    
    await banner.destroy();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
