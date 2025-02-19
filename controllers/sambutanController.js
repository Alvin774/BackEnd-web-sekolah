const Sambutan = require('../models/Sambutan');
const cloudinary = require('../config/cloudinary');
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
 * GET /api/sambutans
 * Mengambil data sambutan terkini.
 */
exports.getSambutan = async (req, res) => {
  try {
    const sambutan = await Sambutan.findOne({ order: [['createdAt', 'DESC']] });
    if (!sambutan) {
      return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    }
    res.json(sambutan);
  } catch (error) {
    console.error("Error fetching sambutan:", error);
    res.status(500).json({ message: "Error fetching sambutan", error: error.message });
  }
};

/**
 * POST /api/sambutans
 * Menambahkan sambutan baru.
 * Jika ada file yang diupload (field 'image'), file diunggah ke Cloudinary.
 */
exports.addSambutan = async (req, res) => {
  try {
    const { title, content, principalName, principalTitle } = req.body;
    let imageUrl = null;
    let imagePublicId = null;
    
    // Jika ada file upload, unggah ke Cloudinary
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, 'sambutan');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    
    // Validasi wajib: content dan principalName
    if (!content || !principalName) {
      return res.status(400).json({ message: "Content dan Principal Name wajib diisi." });
    }
    
    const newSambutan = await Sambutan.create({
      title,
      content,
      principalName,
      principalTitle,
      imageUrl,
      imagePublicId
    });
    res.status(201).json({ message: "Sambutan berhasil ditambahkan", sambutan: newSambutan });
  } catch (error) {
    console.error("Error adding sambutan:", error);
    res.status(500).json({ message: "Error adding sambutan", error: error.message });
  }
};

/**
 * PUT /api/sambutans/:id
 * Memperbarui sambutan berdasarkan ID.
 * Jika ada file baru diupload, gambar lama dihapus dari Cloudinary dan diganti.
 */
exports.updateSambutan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, principalName, principalTitle } = req.body;
    const sambutan = await Sambutan.findByPk(id);
    if (!sambutan) {
      return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    }
    
    // Jika ada file baru diupload, hapus gambar lama dari Cloudinary jika ada
    if (req.file) {
      if (sambutan.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(sambutan.imagePublicId);
          console.log("Old image deleted from Cloudinary");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'sambutan');
      sambutan.imageUrl = result.secure_url;
      sambutan.imagePublicId = result.public_id;
    }
    
    sambutan.title = title !== undefined ? title : sambutan.title;
    sambutan.content = content !== undefined ? content : sambutan.content;
    sambutan.principalName = principalName !== undefined ? principalName : sambutan.principalName;
    sambutan.principalTitle = principalTitle !== undefined ? principalTitle : sambutan.principalTitle;
    
    await sambutan.save();
    res.json({ message: "Sambutan berhasil diperbarui", sambutan });
  } catch (error) {
    console.error("Error updating sambutan:", error);
    res.status(500).json({ message: "Error updating sambutan", error: error.message });
  }
};

/**
 * DELETE /api/sambutans/:id
 * Menghapus sambutan berdasarkan ID dan menghapus gambar terkait dari Cloudinary jika ada.
 */
exports.deleteSambutan = async (req, res) => {
  try {
    const { id } = req.params;
    const sambutan = await Sambutan.findByPk(id);
    if (!sambutan) {
      return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    }
    
    if (sambutan.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(sambutan.imagePublicId);
        console.log("Image deleted from Cloudinary");
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    
    await sambutan.destroy();
    res.json({ message: "Sambutan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting sambutan:", error);
    res.status(500).json({ message: "Error deleting sambutan", error: error.message });
  }
};
