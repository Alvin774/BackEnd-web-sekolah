// models/Sejarah.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sejarah = sequelize.define('Sejarah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'sejarah',
  timestamps: true,
});

module.exports = Sejarah;
