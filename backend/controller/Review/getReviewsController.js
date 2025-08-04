// controller/Review/getReviewsController.js
const ReviewModel = require("../../models/reviewModel");

const getReviewsController = async (req, res) => {
  try {
    // Since GET requests do not have a body, get doctorId from query params
    const { doctorId } = req.query;

    const filter = doctorId ? { doctor: doctorId } : {};

    // No populate since doctor/patient are stored as strings
    const reviews = await ReviewModel.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = getReviewsController;
