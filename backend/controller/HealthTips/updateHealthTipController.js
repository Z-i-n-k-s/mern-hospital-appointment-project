const HealthTipsModel = require("../../models/healthTipsModel");

const updateHealthTipController = async (req, res) => {
  try {
    const { tipId, comment } = req.body;

    if (!tipId || !comment) {
      return res.status(400).json({
        success: false,
        message: "tipId and updated comment are required",
      });
    }

    const updatedTip = await HealthTipsModel.findByIdAndUpdate(
      tipId,
      { comment },
      { new: true }
    );

    if (!updatedTip) {
      return res.status(404).json({
        success: false,
        message: "Health tip not found",
      });
    }

    res.json({
      success: true,
      message: "Health tip updated successfully",
      data: updatedTip,
    });
  } catch (err) {
    console.error("❌ Error updating health tip:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = updateHealthTipController;
