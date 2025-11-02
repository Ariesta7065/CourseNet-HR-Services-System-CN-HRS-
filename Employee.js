import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "terminated", "onLeave"],
      default: "active",
    },
    salary: {
      base: {
        type: Number,
        default: 0,
      },
      bonus: {
        type: Number,
        default: 0,
      },
      allowance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "IDR",
      },
    },
    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // hubungkan ke user untuk login
    },
    performanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

/* 🧩 Middleware: validasi email format */
employeeSchema.path("email").validate(function (value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}, "Invalid email format");

/* ⚡ Auto-update status menjadi inactive jika terminated */
employeeSchema.pre("save", function (next) {
  if (this.status === "terminated") {
    this.isActive = false;
  }
  next();
});

/* 🧠 Virtual Field: total income */
employeeSchema.virtual("totalIncome").get(function () {
  const total = this.salary.base + this.salary.bonus + this.salary.allowance;
  return Number(total.toFixed(2));
});

/* 🔍 Index */
employeeSchema.index({ fullName: 1, email: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
