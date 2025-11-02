const { Employee, Department } = require('../models');

//
// 🟢 Ambil semua employee
//
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('department', 'name description')
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil employee by ID
//
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name description');
    if (!employee)
      return res.status(404).json({ message: 'Employee tidak ditemukan' });

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Tambah employee baru
//
const createEmployee = async (req, res) => {
  try {
    const { name, email, position, departmentId, hireDate } = req.body;

    // Pastikan department valid
    let department = null;
    if (departmentId) {
      department = await Department.findById(departmentId);
      if (!department)
        return res.status(404).json({ message: 'Department tidak ditemukan' });
    }

    const employee = await Employee.create({
      name,
      email,
      position,
      department: departmentId || null,
      hireDate: hireDate || new Date(),
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update employee
//
const updateEmployee = async (req, res) => {
  try {
    const { name, email, position, departmentId, hireDate } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: 'Employee tidak ditemukan' });

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.position = position || employee.position;
    employee.hireDate = hireDate || employee.hireDate;

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department)
        return res.status(404).json({ message: 'Department tidak ditemukan' });
      employee.department = departmentId;
    }

    await employee.save();

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus employee
//
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: 'Employee tidak ditemukan' });

    await employee.remove();
    res.status(200).json({ success: true, message: 'Employee berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
