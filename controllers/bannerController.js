// controllers/bannerController.js

const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

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
 * Menggunakan Multer untuk menangani file upload.
 * Jika file diupload, gunakan file tersebut untuk imageUrl;
 * jika tidak, Anda bisa menggunakan imageUrl dari req.body (tapi field ini wajib diisi minimal).
 */
exports.addBanner = async (req, res) => {
  try {
    const { linkUrl } = req.body;
    let imageUrl = null;
    
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: "Image URL is required" });
    }
    
    const banner = await Banner.create({ imageUrl, linkUrl });
    res.status(201).json({ message: "Banner added successfully", banner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Error adding banner", error: error.message });
  }
};

/**
 * PUT /api/banner/:id
 * Memperbarui banner yang sudah ada.
 * Jika ada file baru diupload, banner lama (gambar) akan dihapus dari disk.
 */
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { linkUrl } = req.body;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    // Jika ada file baru, hapus file lama dan update imageUrl
    if (req.file) {
      if (banner.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', banner.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old banner image:", err);
          } else {
            console.log("Old banner image deleted:", oldFilePath);
          }
        });
      }
      banner.imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    // Update linkUrl jika disediakan
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
 * Menghapus banner beserta file gambarnya (jika ada) dari disk.
 */
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    if (banner.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', banner.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting banner image:", err);
        } else {
          console.log("Banner image deleted:", filePath);
        }
      });
    }
    
    await banner.destroy();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
