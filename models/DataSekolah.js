// models/DataSekolah.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DataSekolah = sequelize.define('DataSekolah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  npsn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bentukPendidikan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusKepemilikan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skPendirian: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalSkPendirian: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  skIzinOperasional: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalSkIzinOperasional: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  kebutuhanKhusus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  namaBank: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cabang: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rekeningAtasNama: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statusBOS: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  waktuPenyelenggaraan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sertifikasiISO: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sumberListrik: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dayaListrik: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kecepatanInternet: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kepsek: { type: DataTypes.STRING, allowNull: true },
  operator: { type: DataTypes.STRING, allowNull: true },
  akreditasi: { type: DataTypes.STRING, allowNull: true },
  kurikulum: { type: DataTypes.STRING, allowNull: true },
  waktu: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'data_sekolah',
  timestamps: true, // Menambahkan createdAt dan updatedAt secara otomatis
});

module.exports = DataSekolah;
