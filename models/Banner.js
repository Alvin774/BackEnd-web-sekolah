// models/Banner.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false, // Pastikan gambar wajib diisi ketika ditambahkan
  },
  linkUrl: {
    type: DataTypes.STRING,
    allowNull: true,  // Opsional, sehingga boleh kosong
  },
}, {
  tableName: 'Banners', // Nama tabel di database
  timestamps: true,     // Menyimpan createdAt dan updatedAt
});

module.exports = Banner;
