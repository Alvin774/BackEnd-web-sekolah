const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }
    // Periksa apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Buat user baru; role default adalah "user"
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });
    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }
    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }
    // Buat token menggunakan jwt (atur JWT_SECRET di environment)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1h' }
    );
    res.json({ message: "Login berhasil", role: user.role, token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
