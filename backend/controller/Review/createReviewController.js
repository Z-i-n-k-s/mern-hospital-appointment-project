const ReviewModel = require("../../models/reviewModel");

// ✅ Create Review
const createReviewController = async (req, res) => {
  try {
    const { doctor, patient, patientName, comment } = req.body;

    if (!doctor || !patient || !patientName || !comment) {
      return res.status(400).json({
        success: false,
        message: "Doctor, patient, patientName, and comment are required",
      });
    }

    const newReview = await ReviewModel.create({
      doctor,
      patient,
      patientName,
      comment,
    });

    res.json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = createReviewController;
