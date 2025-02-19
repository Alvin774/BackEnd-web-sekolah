const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlumniReview = sequelize.define('AlumniReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  alumniName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alumniYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: { // untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'alumniReviews',
  timestamps: true,
});

module.exports = AlumniReview;
