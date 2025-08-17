const HealthTipsModel = require("../../models/healthTipsModel");

const getHealthTipsByPatientAndDoctor = async (req, res) => {
  try {
    const { patient, doctor } = req.body;

    if (!patient || !doctor) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and Doctor ID are required",
      });
    }

    const tips = await HealthTipsModel.find({ patient, doctor }).sort({
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

module.exports = getHealthTipsByPatientAndDoctor;
