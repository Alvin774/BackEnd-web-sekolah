const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fasilitas = sequelize.define('Fasilitas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePublicId: {  // untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'fasilitas',
  timestamps: true,
});

module.exports = Fasilitas;
