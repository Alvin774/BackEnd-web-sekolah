// models/StrukturOrganisasi.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StrukturOrganisasi = sequelize.define('StrukturOrganisasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Posisi atau jabatan, misalnya "Kepala Sekolah", "Sekretaris", dll.
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Nama lengkap orang yang menduduki jabatan tersebut
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Jika null, berarti node ini adalah root (tidak punya induk)
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Urutan jika diperlukan untuk mengurutkan node pada level yang sama
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  }
}, {
  tableName: 'struktur_organisasi',
  timestamps: true, // Menyediakan createdAt dan updatedAt
});

module.exports = StrukturOrganisasi;
