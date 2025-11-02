const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//
// 🔑 Login user
//
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek user ada
    const user = await User.findOne({ email }).populate('employee', 'name email department position');
    if (!user) return res.status(401).json({ message: 'Email atau password salah' });

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email atau password salah' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Register user (opsional)
//
const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    // Cek email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email sudah digunakan' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      employee: employeeId || null,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔐 Middleware proteksi route
//
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  // Format Bearer token
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // menyimpan info user di request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = {
  login,
  register,
  protect,
};
