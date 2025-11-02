const { Department, Employee } = require('../models');

//
// 🟢 Ambil semua department
//
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'name email position')
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil department by ID
//
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('manager', 'name email position');
    if (!department)
      return res.status(404).json({ message: 'Department tidak ditemukan' });

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Tambah department baru
//
const createDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    // Pastikan manager ada
    let manager = null;
    if (managerId) {
      manager = await Employee.findById(managerId);
      if (!manager) return res.status(404).json({ message: 'Manager tidak ditemukan' });
    }

    const department = await Department.create({
      name,
      description,
      manager: managerId || null,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update department
//
const updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: 'Department tidak ditemukan' });

    department.name = name || department.name;
    department.description = description || department.description;

    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager) return res.status(404).json({ message: 'Manager tidak ditemukan' });
      department.manager = managerId;
    }

    await department.save();

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus department
//
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: 'Department tidak ditemukan' });

    await department.remove();
    res.status(200).json({ success: true, message: 'Department berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
