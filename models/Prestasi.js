// models/Prestasi.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestasi = sequelize.define('Prestasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pringkat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'prestasi',
  timestamps: true, // otomatis menambahkan createdAt dan updatedAt
});

module.exports = Prestasi;
