// controllers/pendaftaranController.js

const Pendaftaran = require('../models/Pendaftaran');

// Ambil semua data pendaftaran
exports.getAllPendaftaran = async (req, res) => {
  try {
    const pendaftaranList = await Pendaftaran.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(pendaftaranList);
  } catch (error) {
    console.error("Error retrieving pendaftaran:", error);
    res.status(500).json({ message: "Error retrieving pendaftaran", error: error.message });
  }
};

// Ambil data pendaftaran berdasarkan ID
exports.getPendaftaranById = async (req, res) => {
  try {
    const { id } = req.params;
    const pendaftaran = await Pendaftaran.findByPk(id);
    if (!pendaftaran) {
      return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
    }
    res.json(pendaftaran);
  } catch (error) {
    console.error("Error retrieving pendaftaran:", error);
    res.status(500).json({ message: "Error retrieving pendaftaran", error: error.message });
  }
};

// Tambah data pendaftaran baru
exports.addPendaftaran = async (req, res) => {
  try {
    // Semua data pendaftaran dikirim melalui req.body
    const newPendaftaran = await Pendaftaran.create(req.body);
    res.status(201).json({ message: "Data pendaftaran berhasil ditambahkan", data: newPendaftaran });
  } catch (error) {
    console.error("Error adding pendaftaran:", error);
    res.status(500).json({ message: "Error adding pendaftaran", error: error.message });
  }
};

// Update data pendaftaran berdasarkan ID
exports.updatePendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const pendaftaran = await Pendaftaran.findByPk(id);
    if (!pendaftaran) {
      return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
    }
    await pendaftaran.update(req.body);
    res.json({ message: "Data pendaftaran berhasil diperbarui", data: pendaftaran });
  } catch (error) {
    console.error("Error updating pendaftaran:", error);
    res.status(500).json({ message: "Error updating pendaftaran", error: error.message });
  }
};

// Hapus data pendaftaran berdasarkan ID
exports.deletePendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const pendaftaran = await Pendaftaran.findByPk(id);
    if (!pendaftaran) {
      return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
    }
    await pendaftaran.destroy();
    res.json({ message: "Data pendaftaran berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting pendaftaran:", error);
    res.status(500).json({ message: "Error deleting pendaftaran", error: error.message });
  }
};
