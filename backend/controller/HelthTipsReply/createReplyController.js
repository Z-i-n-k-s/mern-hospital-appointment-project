const ReplyModel = require("../../models/helthTipsReplyModel");
const HealthTipsModel = require("../../models/healthTipsModel");

const createReplyController = async (req, res) => {
  try {
    const { healthTipId, doctor, doctorName, comment } = req.body;

    // Validate required fields
    if (!healthTipId || !doctor || !doctorName || !comment) {
      return res.status(400).json({
        success: false,
        message: "healthTipId, doctor, doctorName, and comment are required",
      });
    }

    // Optional: check if the health tip exists
    const healthTip = await HealthTipsModel.findById(healthTipId);
    if (!healthTip) {
      return res.status(404).json({
        success: false,
        message: "Health tip not found",
      });
    }

    const newReply = await ReplyModel.create({
      healthTipId,
      doctor,
      doctorName,
      comment,
    });

    res.json({
      success: true,
      message: "Reply created successfully",
      data: newReply,
    });
  } catch (err) {
    console.error("❌ Error creating reply:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = createReplyController;
