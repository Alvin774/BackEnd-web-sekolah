const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlurPendaftaran = sequelize.define('AlurPendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: {  // Untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'alurpendaftaran',
  timestamps: true,
});

module.exports = AlurPendaftaran;
