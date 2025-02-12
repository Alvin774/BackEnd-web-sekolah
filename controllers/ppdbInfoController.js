// controllers/ppdbInfoController.js

const PPDBInfo = require('../models/PPDBInfo');

/**
 * GET /api/ppdbinfo
 * Mengambil semua data PPDB Info.
 */
exports.getAllPPDBInfo = async (req, res) => {
  try {
    const info = await PPDBInfo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(info);
  } catch (error) {
    console.error("Error fetching PPDB Info:", error);
    res.status(500).json({ message: "Error fetching PPDB Info", error: error.message });
  }
};

/**
 * POST /api/ppdbinfo
 * Menambahkan data PPDB Info baru.
 */
exports.addPPDBInfo = async (req, res) => {
  try {
    const { infoText, registrationStart, registrationEnd } = req.body;
    if (!infoText || !registrationStart || !registrationEnd) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    const newInfo = await PPDBInfo.create({
      infoText,
      registrationStart,
      registrationEnd
    });
    res.status(201).json({ message: "PPDB Info berhasil ditambahkan", info: newInfo });
  } catch (error) {
    console.error("Error adding PPDB Info:", error);
    res.status(500).json({ message: "Error adding PPDB Info", error: error.message });
  }
};

/**
 * PUT /api/ppdbinfo/:id
 * Memperbarui data PPDB Info berdasarkan ID.
 */
exports.updatePPDBInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { infoText, registrationStart, registrationEnd } = req.body;
    const info = await PPDBInfo.findByPk(id);
    if (!info) {
      return res.status(404).json({ message: "PPDB Info tidak ditemukan" });
    }
    info.infoText = infoText !== undefined ? infoText : info.infoText;
    info.registrationStart = registrationStart !== undefined ? registrationStart : info.registrationStart;
    info.registrationEnd = registrationEnd !== undefined ? registrationEnd : info.registrationEnd;
    await info.save();
    res.json({ message: "PPDB Info berhasil diperbarui", info });
  } catch (error) {
    console.error("Error updating PPDB Info:", error);
    res.status(500).json({ message: "Error updating PPDB Info", error: error.message });
  }
};

/**
 * DELETE /api/ppdbinfo/:id
 * Menghapus data PPDB Info berdasarkan ID.
 */
exports.deletePPDBInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await PPDBInfo.findByPk(id);
    if (!info) {
      return res.status(404).json({ message: "PPDB Info tidak ditemukan" });
    }
    await info.destroy();
    res.json({ message: "PPDB Info berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PPDB Info:", error);
    res.status(500).json({ message: "Error deleting PPDB Info", error: error.message });
  }
};
