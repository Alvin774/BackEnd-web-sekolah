const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePublicId: { // Menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'banners',
  timestamps: true,
});

module.exports = Banner;
