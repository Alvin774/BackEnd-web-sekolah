// models/Pendaftaran.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pendaftaran = sequelize.define('Pendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Informasi Pendaftaran
  taPendaftaran: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  jalurPendaftaran: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  program: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  // Data Siswa
  namaLengkap: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  namaPanggilan: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nisn: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  nis: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  nik: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  tempatLahir: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tanggalLahir: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jenisKelamin: {
    type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    allowNull: false,
  },
  agama: {
    type: DataTypes.ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'),
    allowNull: false,
  },
  alamatSiswa: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rt: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  rw: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  desa: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  kecamatan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  kabupaten: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  provinsi: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  kodePos: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  // Data Orang Tua
  namaAyah: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pekerjaanAyah: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pendidikanAyah: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  namaIbu: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pekerjaanIbu: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pendidikanIbu: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  // Data Wali (opsional)
  hubunganWali: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  namaWali: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  pekerjaanWali: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  pendidikanWali: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Data Sekolah Asal
  jenisPendaftaran: {
    type: DataTypes.ENUM('Peserta Didik Baru', 'Peserta Didik Pindahan'),
    allowNull: false,
  },
  namaSekolah: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  alamatSekolah: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pindahanKelas: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Kontak
  noHp: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  kontakEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: { msg: "Format email tidak valid" }
    }
  },
  // Field untuk mengaitkan pendaftaran dengan user yang login
  registeredBy: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  tableName: 'pendaftaran',
  timestamps: true,
});

module.exports = Pendaftaran;
