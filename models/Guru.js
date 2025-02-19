const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guru = sequelize.define('Guru', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  nip: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: {  // untuk menyimpan public_id dari Cloudinary
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'guru',
  timestamps: true,
});

module.exports = Guru;
