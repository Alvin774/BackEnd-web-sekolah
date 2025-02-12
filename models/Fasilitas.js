// models/Fasilitas.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fasilitas = sequelize.define('Fasilitas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'fasilitas',
  timestamps: true, // Akan menambahkan createdAt dan updatedAt secara otomatis
});

module.exports = Fasilitas;
