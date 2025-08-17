// Controller
const PrescriptionModel = require("../../models/prescriptionModel");

const getPrescriptionsByPatientIdController = async (req, res) => {
  try {
    const patientId = req.query.patientId;
    if (!patientId) {
      return res.status(400).json({
        message: "patientId query param is required",
        success: false,
        error: true,
      });
    }

    const prescriptions = await PrescriptionModel.find({ patientId });

    res.json({
      message: "Prescriptions fetched successfully",
      data: prescriptions,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = getPrescriptionsByPatientIdController;
