// models/PPDBInfo.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PPDBInfo = sequelize.define('PPDBInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Teks untuk marquee informasi penting, misalnya: "[Informasi Penting]"
  infoText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Tanggal mulai pendaftaran (format: YYYY-MM-DD)
  registrationStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Tanggal akhir pendaftaran (format: YYYY-MM-DD)
  registrationEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
}, {
  tableName: 'ppdb_infos',
  timestamps: true,
});

module.exports = PPDBInfo;
