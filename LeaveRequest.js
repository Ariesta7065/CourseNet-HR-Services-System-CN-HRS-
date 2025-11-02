import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: [
        "annual",
        "sick",
        "personal",
        "maternity",
        "paternity",
        "unpaid",
        "other",
      ],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // bisa diisi oleh manager/HR yang menyetujui
    },
    decisionDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* 🧮 Middleware: hitung total hari cuti otomatis */
leaveRequestSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = this.endDate - this.startDate;
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

/* ⚙️ Auto set tanggal keputusan jika status berubah */
leaveRequestSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status !== "pending") {
    this.decisionDate = new Date();
  }
  next();
});

/* 🧠 Virtual Field: status info */
leaveRequestSchema.virtual("statusInfo").get(function () {
  const statusMap = {
    pending: "Menunggu persetujuan HR",
    approved: "Cuti disetujui",
    rejected: "Cuti ditolak",
    cancelled: "Cuti dibatalkan oleh karyawan",
  };
  return statusMap[this.status] || "Tidak diketahui";
});

/* 🔍 Index */
leaveRequestSchema.index({ employee: 1, startDate: 1 });

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;
