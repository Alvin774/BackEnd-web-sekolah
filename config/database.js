// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nama database
  process.env.DB_USER,     // Username database
  process.env.DB_PASSWORD, // Password database
  {
    host: process.env.DB_HOST,  // Host MySQL, misal "localhost"
    port: process.env.PORT,
    dialect: 'mysql',
    logging: false,             // Nonaktifkan logging SQL (opsional)
  }
);

module.exports = sequelize;
