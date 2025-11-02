import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "onLeave"],
      default: "present",
    },
    remarks: {
      type: String,
      trim: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    workHours: {
      type: Number, // total jam kerja
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* 🕒 Auto-hitung jam kerja sebelum disimpan */
attendanceSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    const diff = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.workHours = parseFloat(diff.toFixed(2));
  }

  // ⚡ Jika datang setelah jam 08:05, status = "late"
  const checkInTime = new Date(this.checkIn);
  if (checkInTime && checkInTime.getHours() >= 8 && checkInTime.getMinutes() > 5) {
    this.status = "late";
  }

  next();
});

/* 🔍 Index untuk optimasi pencarian */
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

/* 🧠 Virtual untuk menampilkan nama karyawan otomatis */
attendanceSchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "employee",
  foreignField: "_id",
  justOne: true,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
