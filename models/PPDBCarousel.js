// models/PPDBCarousel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PPDBCarousel = sequelize.define('PPDBCarousel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  captionTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  captionDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  linkUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  }
}, {
  tableName: 'ppdb_carousels',
  timestamps: true, // Menyimpan createdAt dan updatedAt secara otomatis
});

module.exports = PPDBCarousel;
