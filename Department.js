import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    location: {
      type: String,
      default: "Tangerang",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* 🧩 Middleware: validasi nama unik & huruf kapital */
departmentSchema.pre("save", async function (next) {
  this.name = this.name.toUpperCase(); // standarisasi nama
  next();
});

/* 🧠 Virtual Field: jumlah karyawan di department */
departmentSchema.virtual("employeeCount").get(function () {
  return this.employees ? this.employees.length : 0;
});

/* 🔍 Index agar pencarian cepat berdasarkan nama */
departmentSchema.index({ name: 1 });

const Department = mongoose.model("Department", departmentSchema);

export default Department;
