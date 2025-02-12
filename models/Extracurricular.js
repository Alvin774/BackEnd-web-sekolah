// models/Extracurricular.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Extracurricular = sequelize.define('Extracurricular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'extracurriculars',
  timestamps: true, // Akan menambahkan createdAt dan updatedAt secara otomatis
});

module.exports = Extracurricular;
