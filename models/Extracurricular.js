const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Extracurricular = sequelize.define('Extracurricular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'extracurriculars',
  timestamps: true,
});

module.exports = Extracurricular;
