// models/Announcement.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // eventDate akan digunakan untuk mengisi bagian "date-box" (misalnya, "30 Des 2024")
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // eventTime dapat menyimpan informasi tambahan seperti "16:30 WITA" atau detail lainnya
  eventTime: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'announcements', // Nama tabel di database
  timestamps: true,           // Menyimpan createdAt dan updatedAt secara otomatis
});

module.exports = Announcement;
