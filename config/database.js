// config/database.js
const { Sequelize } = require('sequelize');

// Mengambil connection string dari environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  // Opsi tambahan jika diperlukan
});

// Contoh: Cek koneksi
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi berhasil.');
  } catch (error) {
    console.error('Koneksi gagal:', error);
  }
}
testConnection();