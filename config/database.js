// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_DATABASE_URL, {
  dialect: 'mysql',
  logging: false, // Nonaktifkan logging SQL (opsional)
});

module.exports = sequelize;
