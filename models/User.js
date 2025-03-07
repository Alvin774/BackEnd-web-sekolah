// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {  // Menggunakan 'name' sesuai dengan input register
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Format email tidak valid"
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Secara default, role adalah 'user'. Admin bisa ditentukan secara manual
  },
}, {
  tableName: 'users',
  timestamps: true, // otomatis menambahkan createdAt dan updatedAt
});

module.exports = User;
