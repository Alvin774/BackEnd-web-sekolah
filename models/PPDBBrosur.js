// models/PPDBBrosur.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PPDBBrosur = sequelize.define('PPDBBrosur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // URL gambar brosur PPDB (misalnya: "/uploads/poto-brosur-ppdb.jpg")
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'ppdb_brosurs',
  timestamps: true,
});

module.exports = PPDBBrosur;
