// controllers/sambutanController.js

const Sambutan = require('../models/Sambutan');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/sambutans
 * Mengambil data sambutan.
 * Jika hanya ada satu sambutan, kita bisa menggunakan findOne().
 * Di sini, saya menggunakan findOne() untuk mengambil sambutan terkini.
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
 * Mendukung upload file untuk foto (field 'image').
 */
exports.addSambutan = async (req, res) => {
  try {
    const { title, content, principalName, principalTitle } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    }
    if (!content || !principalName) {
      return res.status(400).json({ message: "Content dan Principal Name wajib diisi." });
    }
    const newSambutan = await Sambutan.create({
      title,
      content,
      principalName,
      principalTitle,
      imageUrl
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
 * Jika ada file baru yang diupload, hapus file gambar lama (jika ada).
 */
exports.updateSambutan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, principalName, principalTitle } = req.body;
    const sambutan = await Sambutan.findByPk(id);
    if (!sambutan) {
      return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    }
    
    // Jika ada file baru diupload, hapus file lama (jika ada)
    if (req.file) {
      if (sambutan.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', sambutan.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted:", oldFilePath);
          }
        });
      }
      sambutan.imageUrl = '/public/uploads/' + req.file.filename;
    }
    
    // Update field lainnya jika disediakan
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
 * Menghapus sambutan berdasarkan ID, serta menghapus file gambar terkait jika ada.
 */
exports.deleteSambutan = async (req, res) => {
  try {
    const { id } = req.params;
    const sambutan = await Sambutan.findByPk(id);
    if (!sambutan) {
      return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    }
    
    // Jika ada gambar, hapus file dari disk
    if (sambutan.imageUrl) {
      const filePath = path.join(__dirname, '..', 'public', sambutan.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });
    }
    
    await sambutan.destroy();
    res.json({ message: "Sambutan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting sambutan:", error);
    res.status(500).json({ message: "Error deleting sambutan", error: error.message });
  }
};
