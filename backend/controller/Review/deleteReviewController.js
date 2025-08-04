
const ReviewModel = require("../../models/reviewModel");
const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Review ID is required" });

    const result = await ReviewModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = deleteReviewController