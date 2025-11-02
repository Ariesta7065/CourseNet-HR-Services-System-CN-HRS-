import mongoose from "mongoose";

const performanceReviewSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // biasanya manager atau HR
      required: true,
    },
    reviewPeriodStart: {
      type: Date,
      required: true,
    },
    reviewPeriodEnd: {
      type: Date,
      required: true,
    },
    criteria: [
      {
        name: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
        weight: { type: Number, min: 0, max: 1, default: 0.2 }, // bobot tiap kriteria
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    performanceLevel: {
      type: String,
      enum: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Needs Improvement", "Unsatisfactory"],
      default: "Meets Expectations",
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    recommendations: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "finalized"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

/* 🧮 Middleware: hitung skor keseluruhan otomatis */
performanceReviewSchema.pre("save", function (next) {
  if (this.criteria && this.criteria.length > 0) {
    let totalWeight = 0;
    let weightedScore = 0;

    this.criteria.forEach((c) => {
      totalWeight += c.weight;
      weightedScore += c.score * c.weight;
    });

    this.overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

    // Tentukan level performa berdasarkan skor
    if (this.overallScore >= 90) this.performanceLevel = "Outstanding";
    else if (this.overallScore >= 80) this.performanceLevel = "Exceeds Expectations";
    else if (this.overallScore >= 70) this.performanceLevel = "Meets Expectations";
    else if (this.overallScore >= 60) this.performanceLevel = "Needs Improvement";
    else this.performanceLevel = "Unsatisfactory";
  }

  next();
});

/* 🧠 Virtual Field: status info */
performanceReviewSchema.virtual("statusInfo").get(function () {
  const info = {
    draft: "Masih dalam proses penilaian",
    submitted: "Menunggu finalisasi HR",
    finalized: "Sudah disetujui dan disimpan",
  };
  return info[this.status] || "Tidak diketahui";
});

/* 🔍 Index */
performanceReviewSchema.index({ employee: 1, reviewPeriodEnd: -1 });

const PerformanceReview = mongoose.model("PerformanceReview", performanceReviewSchema);

export default PerformanceReview;
