const HealthTipsModel = require("../../models/healthTipsModel");

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

module.exports = getHealthTipsByPatient;
