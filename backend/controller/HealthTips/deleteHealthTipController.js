const HealthTipsModel = require("../../models/healthTipsModel");

const deleteHealthTipController = async (req, res) => {
  try {
    const { tipId } = req.body;

    if (!tipId) {
      return res.status(400).json({
        success: false,
        message: "tipId is required",
      });
    }

    const deletedTip = await HealthTipsModel.findByIdAndDelete(tipId);

    if (!deletedTip) {
      return res.status(404).json({
        success: false,
        message: "Health tip not found",
      });
    }

    res.json({
      success: true,
      message: "Health tip deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting health tip:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = deleteHealthTipController;
