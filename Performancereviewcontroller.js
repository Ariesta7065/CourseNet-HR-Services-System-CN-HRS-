const { PerformanceReview, Employee } = require('../models');

//
// 🟢 Ambil semua performance review
//
const getAllReviews = async (req, res) => {
  try {
    const reviews = await PerformanceReview.find()
      .populate('employee', 'name email department position')
      .sort({ reviewDate: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔹 Ambil performance review by ID
//
const getReviewById = async (req, res) => {
  try {
    const review = await PerformanceReview.findById(req.params.id)
      .populate('employee', 'name email department position');
    if (!review)
      return res.status(404).json({ message: 'Performance review tidak ditemukan' });

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Buat performance review baru
//
const createReview = async (req, res) => {
  try {
    const { employeeId, reviewDate, rating, comments } = req.body;

    // Pastikan employee ada
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee tidak ditemukan' });

    const review = await PerformanceReview.create({
      employee: employeeId,
      reviewDate: reviewDate || new Date(),
      rating,
      comments,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ✏️ Update performance review
//
const updateReview = async (req, res) => {
  try {
    const { reviewDate, rating, comments } = req.body;

    const review = await PerformanceReview.findById(req.params.id);
    if (!review)
      return res.status(404).json({ message: 'Performance review tidak ditemukan' });

    review.reviewDate = reviewDate || review.reviewDate;
    review.rating = rating !== undefined ? rating : review.rating;
    review.comments = comments || review.comments;

    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// ❌ Hapus performance review
//
const deleteReview = async (req, res) => {
  try {
    const review = await PerformanceReview.findById(req.params.id);
    if (!review)
      return res.status(404).json({ message: 'Performance review tidak ditemukan' });

    await review.remove();
    res.status(200).json({ success: true, message: 'Performance review berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
