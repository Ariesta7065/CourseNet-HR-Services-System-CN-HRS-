const { Payroll, Employee } = require('../models');

//
// 🟢 Ambil semua payroll
//
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('employee', 'name email department position')
      .sort({ payDate: -1 });
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil payroll by ID
//
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'name email department position');
    if (!payroll)
      return res.status(404).json({ message: 'Payroll tidak ditemukan' });

    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Buat payroll baru
//
const createPayroll = async (req, res) => {
  try {
    const { employeeId, payDate, basicSalary, bonuses, deductions } = req.body;

    // Pastikan employee ada
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee tidak ditemukan' });

    const totalSalary = (basicSalary || 0) + (bonuses || 0) - (deductions || 0);

    const payroll = await Payroll.create({
      employee: employeeId,
      payDate: payDate || new Date(),
      basicSalary: basicSalary || 0,
      bonuses: bonuses || 0,
      deductions: deductions || 0,
      totalSalary,
    });

    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update payroll
//
const updatePayroll = async (req, res) => {
  try {
    const { payDate, basicSalary, bonuses, deductions } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll)
      return res.status(404).json({ message: 'Payroll tidak ditemukan' });

    payroll.payDate = payDate || payroll.payDate;
    payroll.basicSalary = basicSalary !== undefined ? basicSalary : payroll.basicSalary;
    payroll.bonuses = bonuses !== undefined ? bonuses : payroll.bonuses;
    payroll.deductions = deductions !== undefined ? deductions : payroll.deductions;
    payroll.totalSalary = (payroll.basicSalary || 0) + (payroll.bonuses || 0) - (payroll.deductions || 0);

    await payroll.save();

    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus payroll
//
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll)
      return res.status(404).json({ message: 'Payroll tidak ditemukan' });

    await payroll.remove();
    res.status(200).json({ success: true, message: 'Payroll berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
};
