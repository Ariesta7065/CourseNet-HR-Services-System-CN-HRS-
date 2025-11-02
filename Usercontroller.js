const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

//
// 🟢 Ambil semua user
//
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('employee', 'name email department position')
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil user by ID
//
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('employee', 'name email department position');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Buat user baru
//
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    // Cek email sudah digunakan
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email sudah digunakan' });

    // Pastikan employee valid
    let employee = null;
    if (employeeId) {
      employee = await Employee.findById(employeeId);
      if (!employee)
        return res.status(404).json({ message: 'Employee tidak ditemukan' });
    }

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
// ✏️ Update user
//
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.role = role || user.role;

    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee)
        return res.status(404).json({ message: 'Employee tidak ditemukan' });
      user.employee = employeeId;
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus user
//
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    await user.remove();
    res.status(200).json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
