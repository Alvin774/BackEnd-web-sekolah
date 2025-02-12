// controllers/newsController.js

const fs = require('fs');
const path = require('path');
const News = require('../models/News');

/**
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
 * Menambahkan berita baru.
 * Data yang diterima: title, description, uploadTime (dari req.body)
 * Jika ada file yang diupload (gambar), maka file tersebut diproses oleh Multer dan disimpan.
 * Pastikan endpoint di route menggunakan middleware: upload.single('image')
 */
exports.addNews = async (req, res) => {
  try {
    const { title, description, uploadTime } = req.body;
    let imageUrl = null;

    // Jika terdapat file yang diupload, simpan URL yang dapat diakses secara publik.
    if (req.file) {
      imageUrl = '/public/uploads/' + req.file.filename;
    }

    const news = await News.create({ title, description, imageUrl, uploadTime });
    res.status(201).json({ message: 'Berita berhasil ditambahkan', news });
  } catch (error) {
    console.error('Error menambahkan berita:', error);
    res.status(500).json({ message: 'Error menambahkan berita', error: error.message });
  }
};

/**
 * Menghapus berita berdasarkan ID.
 * Jika berita memiliki file gambar, file tersebut juga akan dihapus dari disk.
 */
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    // Hapus file gambar dari disk jika ada
    if (news.imageUrl) {
      // news.imageUrl disimpan dalam format "/uploads/filename.ext"
      const filePath = path.join(__dirname, '..', 'public', news.imageUrl.substring(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Gagal menghapus file gambar:', err);
        } else {
          console.log('File gambar berhasil dihapus:', filePath);
        }
      });
    }

    await news.destroy();
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    console.error('Error menghapus berita:', error);
    res.status(500).json({ message: 'Error menghapus berita', error: error.message });
  }
};

/**
 * (Opsional) Memperbarui berita berdasarkan ID.
 * Jika ada file baru yang diupload, gambar lama akan dihapus dan diganti dengan yang baru.
 */
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, uploadTime } = req.body;
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    // Jika ada file baru yang diupload, hapus file gambar lama (jika ada)
    if (req.file) {
      if (news.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', news.imageUrl.substring(1));
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Gagal menghapus file gambar lama:', err);
          } else {
            console.log('File gambar lama berhasil dihapus:', oldFilePath);
          }
        });
      }
      news.imageUrl = '/public/uploads/' + req.file.filename;
    }

    // Perbarui field lainnya
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
