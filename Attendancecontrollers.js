const { Attendance, Employee } = require('../models');

//
// 🟢 Ambil semua attendance
//
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('employee', 'name email department')
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil attendance by ID
//
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee', 'name email department');
    if (!attendance)
      return res.status(404).json({ message: 'Attendance tidak ditemukan' });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Tambah attendance baru
//
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date, checkIn, checkOut, status, remarks, location } = req.body;

    // Pastikan employee ada
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee tidak ditemukan' });

    const attendance = await Attendance.create({
      employee: employeeId,
      date: date || new Date(),
      checkIn,
      checkOut,
      status,
      remarks,
      location,
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update attendance
//
const updateAttendance = async (req, res) => {
  try {
    const { date, checkIn, checkOut, status, remarks, location } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance)
      return res.status(404).json({ message: 'Attendance tidak ditemukan' });

    attendance.date = date || attendance.date;
    attendance.checkIn = checkIn || attendance.checkIn;
    attendance.checkOut = checkOut || attendance.checkOut;
    attendance.status = status || attendance.status;
    attendance.remarks = remarks || attendance.remarks;
    attendance.location = location || attendance.location;

    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus attendance
//
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance)
      return res.status(404).json({ message: 'Attendance tidak ditemukan' });

    await attendance.remove();
    res.status(200).json({ success: true, message: 'Attendance berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
