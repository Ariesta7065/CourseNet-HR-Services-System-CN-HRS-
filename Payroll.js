import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      default: 0,
    },
    allowance: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    leaveDeduction: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "onHold"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cash", "ewallet"],
      default: "bank_transfer",
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

/* 🧮 Middleware: hitung gaji bersih otomatis */
payrollSchema.pre("save", function (next) {
  const grossSalary = this.baseSalary + this.allowance + this.bonus;
  this.netSalary = Math.max(grossSalary - (this.deduction + this.leaveDeduction), 0);
  next();
});

/* ⚙️ Auto set tanggal pembayaran jika status berubah ke 'paid' */
payrollSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "paid") {
    this.paymentDate = new Date();
  }
  next();
});

/* 🧠 Virtual Field: ringkasan gaji */
payrollSchema.virtual("summary").get(function () {
  return {
    gross: this.baseSalary + this.allowance + this.bonus,
    totalDeduction: this.deduction + this.leaveDeduction,
    net: this.netSalary,
  };
});

/* 🔍 Index */
payrollSchema.index({ employee: 1, periodStart: 1, periodEnd: 1 });

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
