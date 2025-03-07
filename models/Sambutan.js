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
    allowNull: true, // Opsional, karena controller tidak mewajibkan title
  },
  content: {
    type: DataTypes.TEXT(150),
    allowNull: false, // Wajib diisi
  },
  principalName: {
    type: DataTypes.STRING,
    allowNull: false, // Wajib diisi
  },
  principalTitle: {
    type: DataTypes.STRING,
    allowNull: true, // Opsional, bisa kosong
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: { // Field untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'sambutans',
  timestamps: true,
});

module.exports = Sambutan;
