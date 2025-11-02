// controllers/index.js
const employeeController = require('./Employeercontroller');
const leaveRequestController = require('./LeaveRequestcontroller');
const payrollController = require('./payrollController');
const performanceReviewController = require('./Performancereviewcontroller');
const userController = require('./UserController');
const attendanceController = require('./attendanceController');
const departmentController = require('./departmentController');
const authController = require('./authController');

module.exports = {
  Employeecontroller,
  LeaveRequestcontroller,
  Payrollcontroller,
  PerformanceReviewcontroller,
  Usercontroller,
  Attendancecontroller,
  Departmentcontroller,
  Authcontroller,
};
