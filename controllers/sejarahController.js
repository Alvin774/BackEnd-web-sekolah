const Sejarah = require('../models/Sejarah');

/**
 * GET /api/sejarah
 * Mengambil data sejarah terkini.
 * Jika hanya ada satu record, menggunakan findOne().
 */
exports.getSejarah = async (req, res) => {
  try {
    const sejarah = await Sejarah.findOne({ order: [['createdAt', 'DESC']] });
    if (!sejarah) {
      return res.status(404).json({ message: "Sejarah tidak ditemukan" });
    }
    res.json(sejarah);
  } catch (error) {
    console.error("Error fetching sejarah:", error);
    res.status(500).json({ message: "Error fetching sejarah", error: error.message });
  }
};

/**
 * POST /api/sejarah
 * Menambahkan data sejarah baru.
 */
exports.addSejarah = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content wajib diisi" });
    }
    const newSejarah = await Sejarah.create({ content });
    res.status(201).json({ message: "Sejarah berhasil ditambahkan", sejarah: newSejarah });
  } catch (error) {
    console.error("Error adding sejarah:", error);
    res.status(500).json({ message: "Error adding sejarah", error: error.message });
  }
};

/**
 * PUT /api/sejarah/:id
 * Memperbarui data sejarah berdasarkan ID.
 */
exports.updateSejarah = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const sejarah = await Sejarah.findByPk(id);
    if (!sejarah) {
      return res.status(404).json({ message: "Sejarah tidak ditemukan" });
    }
    sejarah.content = content || sejarah.content;
    await sejarah.save();
    res.json({ message: "Sejarah berhasil diperbarui", sejarah });
  } catch (error) {
    console.error("Error updating sejarah:", error);
    res.status(500).json({ message: "Error updating sejarah", error: error.message });
  }
};

/**
 * DELETE /api/sejarah/:id
 * Menghapus data sejarah berdasarkan ID.
 */
exports.deleteSejarah = async (req, res) => {
  try {
    const { id } = req.params;
    const sejarah = await Sejarah.findByPk(id);
    if (!sejarah) {
      return res.status(404).json({ message: "Sejarah tidak ditemukan" });
    }
    await sejarah.destroy();
    res.json({ message: "Sejarah berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting sejarah:", error);
    res.status(500).json({ message: "Error deleting sejarah", error: error.message });
  }
};
