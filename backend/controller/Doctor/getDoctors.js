const DoctorModel = require("../../models/doctorModel");

const getDoctorsController = async (req, res) => {
    try {
        const allDoctors = await DoctorModel.find().sort({ createdAt: -1 });
        res.json({
            message: "All doctors",
            data: allDoctors,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getDoctorsController;
