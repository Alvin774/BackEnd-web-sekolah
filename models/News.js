// models/News.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {  
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {  
    type: DataTypes.STRING,
    allowNull: true,
  },
  uploadTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = News;
