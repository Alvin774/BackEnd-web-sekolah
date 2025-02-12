// models/AlurPendaftaran.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlurPendaftaran = sequelize.define('AlurPendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Nomor urut langkah pendaftaran
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // URL gambar untuk langkah pendaftaran
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Deskripsi langkah pendaftaran
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'alur_pendaftarans',
  timestamps: true,
});

module.exports = AlurPendaftaran;
