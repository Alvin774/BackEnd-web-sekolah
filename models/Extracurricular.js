const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Extracurricular = sequelize.define('Extracurricular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(200),
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
