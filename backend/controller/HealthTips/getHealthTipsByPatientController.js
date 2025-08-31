const HealthTipsModel = require("../../models/healthTipsModel");
const ReplyModel = require("../../models/helthTipsReplyModel");

// Fetch health tips by patient along with replies
const getHealthTipsByPatient = async (req, res) => {
  try {
    const { patient } = req.body;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const tips = await HealthTipsModel.find({ patient }).sort({
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

module.exports = getHealthTipsByPatient;
