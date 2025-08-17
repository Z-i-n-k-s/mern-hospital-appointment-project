const HealthTipsModel = require("../../models/healthTipsModel");

const createHealthTipController = async (req, res) => {
  try {
    const { doctor, doctorName, patient, patientName, comment } = req.body;

    if (!doctor || !doctorName || !patient || !patientName || !comment) {
      return res.status(400).json({
        success: false,
        message: "Doctor, doctorName, patient, patientName, and comment are required",
      });
    }

    const newHealthTip = await HealthTipsModel.create({
      doctor,
      doctorName,
      patient,
      patientName,
      comment,
    });

    res.json({
      success: true,
      message: "Health tip created successfully",
      data: newHealthTip,
    });
  } catch (err) {
    console.error("❌ Error creating health tip:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = createHealthTipController;
