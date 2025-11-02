const { LeaveRequest, Employee } = require('../models');

//
// 🟢 Ambil semua leave request
//
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate('employee', 'name email department')
      .sort({ startDate: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil leave request by ID
//
const getLeaveRequestById = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'name email department');
    if (!leave)
      return res.status(404).json({ message: 'Leave request tidak ditemukan' });

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Buat leave request baru
//
const createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, status } = req.body;

    // Pastikan employee ada
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee tidak ditemukan' });

    const leave = await LeaveRequest.create({
      employee: employeeId,
      startDate,
      endDate,
      reason,
      status: status || 'pending', // default pending
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update leave request
//
const updateLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, status } = req.body;

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave)
      return res.status(404).json({ message: 'Leave request tidak ditemukan' });

    leave.startDate = startDate || leave.startDate;
    leave.endDate = endDate || leave.endDate;
    leave.reason = reason || leave.reason;
    leave.status = status || leave.status;

    await leave.save();

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus leave request
//
const deleteLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave)
      return res.status(404).json({ message: 'Leave request tidak ditemukan' });

    await leave.remove();
    res.status(200).json({ success: true, message: 'Leave request berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
};
