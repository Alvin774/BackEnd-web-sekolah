const News = require('../models/News');
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
 * GET /api/news
 * Mengambil semua berita, diurutkan berdasarkan tanggal upload terbaru.
 */
exports.getAllNews = async (req, res) => {
  try {
    const newsList = await News.findAll({ order: [['uploadTime', 'DESC']] });
    res.json(newsList);
  } catch (error) {
    console.error('Error mengambil berita:', error);
    res.status(500).json({ message: 'Error mengambil berita', error: error.message });
  }
};

/**
 * POST /api/news
 * Menambahkan berita baru.
 * Data yang diterima: title, description, uploadTime (dari req.body)
 * Jika ada file yang diupload (gambar), file tersebut diupload ke Cloudinary.
 */
exports.addNews = async (req, res) => {
  try {
    const { title, description, uploadTime } = req.body;
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, 'news');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const news = await News.create({ title, description, imageUrl, imagePublicId, uploadTime });
    res.status(201).json({ message: 'Berita berhasil ditambahkan', news });
  } catch (error) {
    console.error('Error menambahkan berita:', error);
    res.status(500).json({ message: 'Error menambahkan berita', error: error.message });
  }
};

/**
 * DELETE /api/news/:id
 * Menghapus berita berdasarkan ID.
 * Jika berita memiliki file gambar, file tersebut dihapus dari Cloudinary.
 */
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    if (news.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(news.imagePublicId);
        console.log('Gambar berhasil dihapus dari Cloudinary');
      } catch (error) {
        console.error('Gagal menghapus gambar dari Cloudinary:', error);
      }
    }

    await news.destroy();
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    console.error('Error menghapus berita:', error);
    res.status(500).json({ message: 'Error menghapus berita', error: error.message });
  }
};

/**
 * PUT /api/news/:id
 * Memperbarui berita berdasarkan ID.
 * Jika ada file baru yang diupload, gambar lama dihapus dari Cloudinary dan diganti dengan yang baru.
 */
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, uploadTime } = req.body;
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    if (req.file) {
      if (news.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(news.imagePublicId);
          console.log('Gambar lama berhasil dihapus dari Cloudinary');
        } catch (error) {
          console.error('Gagal menghapus gambar lama dari Cloudinary:', error);
        }
      }
      const result = await uploadFromBuffer(req.file.buffer, 'news');
      news.imageUrl = result.secure_url;
      news.imagePublicId = result.public_id;
    }

    news.title = title || news.title;
    news.description = description || news.description;
    news.uploadTime = uploadTime || news.uploadTime;

    await news.save();
    res.json({ message: 'Berita berhasil diperbarui', news });
  } catch (error) {
    console.error('Error memperbarui berita:', error);
    res.status(500).json({ message: 'Error memperbarui berita', error: error.message });
  }
};
