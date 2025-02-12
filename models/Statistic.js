// models/Statistic.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Statistic = sequelize.define('Statistic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  siswa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  gedung: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  guruStaff: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  prestasi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'statistics',
  timestamps: true,
});

module.exports = Statistic;
