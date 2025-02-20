const Announcement = require('../models/Announcement');

/**
 * GET /api/announcements
 * Mengambil semua pengumuman/agenda, diurutkan berdasarkan eventDate secara descending.
 */
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({ order: [['eventDate', 'DESC']] });
    res.json(announcements);
  } catch (error) {
    console.error("Error retrieving announcements:", error);
    res.status(500).json({ message: "Error retrieving announcements", error: error.message });
  }
};

/**
 * POST /api/announcements
 * Menambahkan pengumuman/agenda baru.
 * Pastikan field title, content, dan eventDate diisi.
 */
exports.addAnnouncement = async (req, res) => {
  try {
    const { title, content, eventDate, eventTime } = req.body;
    
    if (!title || !content || !eventDate) {
      return res.status(400).json({ message: "Title, content, and eventDate are required" });
    }
    
    const announcement = await Announcement.create({ title, content, eventDate, eventTime });
    res.status(201).json({ message: "Announcement added successfully", announcement });
  } catch (error) {
    console.error("Error adding announcement:", error);
    res.status(500).json({ message: "Error adding announcement", error: error.message });
  }
};

/**
 * PUT /api/announcements/:id
 * Memperbarui pengumuman/agenda yang sudah ada.
 */
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, eventDate, eventTime } = req.body;
    const announcement = await Announcement.findByPk(id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.eventDate = eventDate || announcement.eventDate;
    announcement.eventTime = eventTime || announcement.eventTime;
    
    await announcement.save();
    res.json({ message: "Announcement updated successfully", announcement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Error updating announcement", error: error.message });
  }
};

/**
 * DELETE /api/announcements/:id
 * Menghapus pengumuman/agenda berdasarkan ID.
 */
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    await announcement.destroy();
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Error deleting announcement", error: error.message });
  }
};
