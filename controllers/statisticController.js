// controllers/statisticController.js

const Statistic = require('../models/Statistic');

/**
 * GET /api/statistics
 * Mengambil data statistik. Diasumsikan hanya ada satu record yang menyimpan data statistik terkini.
 */
exports.getStatistics = async (req, res) => {
  try {
    // Mengambil record statistik pertama (jika belum ada, bisa dibuat secara default di admin)
    const statistic = await Statistic.findOne();
    if (!statistic) {
      return res.status(404).json({ message: "Statistics not found" });
    }
    res.json(statistic);
  } catch (error) {
    console.error("Error retrieving statistics:", error);
    res.status(500).json({ message: "Error retrieving statistics", error: error.message });
  }
};

/**
 * PUT /api/statistics
 * Memperbarui data statistik.
 * Body harus berisi nilai-nilai: siswa, gedung, guruStaff, dan prestasi (semua optional, akan di-update jika disediakan)
 */
exports.updateStatistics = async (req, res) => {
  try {
    const { siswa, gedung, guruStaff, prestasi } = req.body;
    // Ambil record statistik pertama; jika tidak ada, buat record baru.
    let statistic = await Statistic.findOne();
    if (!statistic) {
      statistic = await Statistic.create({ siswa, gedung, guruStaff, prestasi });
    } else {
      statistic.siswa = siswa !== undefined ? siswa : statistic.siswa;
      statistic.gedung = gedung !== undefined ? gedung : statistic.gedung;
      statistic.guruStaff = guruStaff !== undefined ? guruStaff : statistic.guruStaff;
      statistic.prestasi = prestasi !== undefined ? prestasi : statistic.prestasi;
      await statistic.save();
    }
    res.json({ message: "Statistics updated successfully", statistic });
  } catch (error) {
    console.error("Error updating statistics:", error);
    res.status(500).json({ message: "Error updating statistics", error: error.message });
  }
};
