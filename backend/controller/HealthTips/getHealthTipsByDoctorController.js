const HealthTipsModel = require("../../models/healthTipsModel");
const ReplyModel = require("../../models/helthTipsReplyModel");

// Fetch health tips by doctor along with replies
const getHealthTipsByDoctor = async (req, res) => {
  try {
    const { doctor } = req.body;

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const tips = await HealthTipsModel.find({ doctor }).sort({
      createdAt: -1,
    });

    // Fetch replies for each tip
    const tipsWithReplies = await Promise.all(
      tips.map(async (tip) => {
        const replies = await ReplyModel.find({ healthTipId: tip._id });
        return { ...tip.toObject(), replies };
      })
    );

    res.json({
      success: true,
      message: "Health tips with replies fetched successfully",
      data: tipsWithReplies,
    });
  } catch (err) {
    console.error("❌ Error fetching health tips:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = getHealthTipsByDoctor;
