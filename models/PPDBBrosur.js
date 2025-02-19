// models/PPDBBrosur.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PPDBBrosur = sequelize.define('PPDBBrosur', {
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
  }
}, {
  tableName: 'ppdbbrosur',
  timestamps: true,
});

module.exports = PPDBBrosur;
