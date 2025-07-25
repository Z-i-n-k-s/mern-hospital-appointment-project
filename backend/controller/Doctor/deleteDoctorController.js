const DoctorModel = require("../../models/doctorModel");



const deleteDoctorController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Doctor ID is required" });

    const result = await DoctorModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = deleteDoctorController;
