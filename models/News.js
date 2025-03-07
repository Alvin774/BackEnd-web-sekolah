const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT(200),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: { // Untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  },
  uploadTime: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'news',
  timestamps: true,
});

module.exports = News;
