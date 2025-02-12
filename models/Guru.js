// models/Guru.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guru = sequelize.define('Guru', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { // Nama guru
    type: DataTypes.STRING,
    allowNull: false,
  },
  nip: { // Nomor Induk Pegawai, opsional
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: { // URL foto guru, opsional
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'gurus',
  timestamps: true,
});

module.exports = Guru;
