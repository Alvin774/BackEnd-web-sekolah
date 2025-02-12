// models/Sambutan.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sambutan = sequelize.define('Sambutan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Sambutan Kepala Sekolah"
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  principalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  principalTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Kepala Sekolah"
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'sambutans', // Nama tabel di database
  timestamps: true,      // Menyimpan createdAt dan updatedAt secara otomatis
});

module.exports = Sambutan;
