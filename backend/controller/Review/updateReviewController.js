
const ReviewModel = require("../../models/reviewModel");

const updateReviewController = async (req, res) => {
  try {
    const { id, comment } = req.body;

    if (!id || !comment) {
      return res.status(400).json({ success: false, message: "Review ID and new comment are required" });
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      id,
      { comment },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review updated successfully", data: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports =updateReviewController