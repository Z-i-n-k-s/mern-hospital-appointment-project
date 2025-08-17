const HealthTipsModel = require("../../models/healthTipsModel");

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

    res.json({
      success: true,
      message: "Health tips fetched successfully",
      data: tips,
    });
  } catch (err) {
    console.error("❌ Error fetching health tips:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = getHealthTipsByDoctor;
