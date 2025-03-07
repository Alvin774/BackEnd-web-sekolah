const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestasi = sequelize.define('Prestasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  pringkat: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'prestasi',
  timestamps: true,
});

module.exports = Prestasi;
