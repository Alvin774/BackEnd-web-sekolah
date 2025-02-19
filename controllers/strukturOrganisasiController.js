// controllers/strukturOrganisasiController.js

const StrukturOrganisasi = require('../models/StrukturOrganisasi');

/**
 * GET /api/strukturorganisasi
 * Mengambil semua data struktur organisasi.
 */
exports.getAllStrukturOrganisasi = async (req, res) => {
  try {
    const data = await StrukturOrganisasi.findAll({
      order: [['parentId', 'ASC'], ['order', 'ASC']]
    });
    res.json(data);
  } catch (error) {
    console.error("Error fetching struktur organisasi:", error);
    res.status(500).json({ message: "Error fetching struktur organisasi", error: error.message });
  }
};

/**
 * POST /api/strukturorganisasi
 * Menambahkan data struktur organisasi baru.
 */
exports.addStrukturOrganisasi = async (req, res) => {
  try {
    const { position, name, parentId, order } = req.body;
    if (!position || !name) {
      return res.status(400).json({ message: "Position dan name wajib diisi." });
    }
    const newRecord = await StrukturOrganisasi.create({
      position,
      name,
      parentId: parentId || null,
      order: order || 0
    });
    res.status(201).json({ message: "Data struktur organisasi berhasil ditambahkan", data: newRecord });
  } catch (error) {
    console.error("Error adding struktur organisasi:", error);
    res.status(500).json({ message: "Error adding struktur organisasi", error: error.message });
  }
};

/**
 * PUT /api/strukturorganisasi/:id
 * Memperbarui data struktur organisasi berdasarkan ID.
 */
exports.updateStrukturOrganisasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, name, parentId, order } = req.body;
    const record = await StrukturOrganisasi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Data struktur organisasi tidak ditemukan" });
    }
    record.position = position !== undefined ? position : record.position;
    record.name = name !== undefined ? name : record.name;
    record.parentId = parentId !== undefined ? parentId : record.parentId;
    record.order = order !== undefined ? order : record.order;
    
    await record.save();
    res.json({ message: "Data struktur organisasi berhasil diperbarui", data: record });
  } catch (error) {
    console.error("Error updating struktur organisasi:", error);
    res.status(500).json({ message: "Error updating struktur organisasi", error: error.message });
  }
};

/**
 * DELETE /api/strukturorganisasi/:id
 * Menghapus data struktur organisasi berdasarkan ID.
 */
exports.deleteStrukturOrganisasi = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await StrukturOrganisasi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Data struktur organisasi tidak ditemukan" });
    }
    await record.destroy();
    res.json({ message: "Data struktur organisasi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting struktur organisasi:", error);
    res.status(500).json({ message: "Error deleting struktur organisasi", error: error.message });
  }
};
