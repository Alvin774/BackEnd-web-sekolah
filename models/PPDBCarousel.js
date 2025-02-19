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
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  captionTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  captionDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'ppdbcarousel',
  timestamps: true,
});

module.exports = PPDBCarousel;
