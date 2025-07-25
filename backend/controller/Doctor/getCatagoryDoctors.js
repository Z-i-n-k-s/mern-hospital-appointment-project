const DoctorModel = require("../../models/doctorModel");

const getCategoryDoctors = async (req, res) => {
    try {
        const doctorCategories = await DoctorModel.distinct("category");

        const doctorsByCategory = [];
        for (const category of doctorCategories) {
            const doctor = await DoctorModel.findOne({ category });
            if (doctor) {
                doctorsByCategory.push(doctor);
            }
        }

        res.json({
            message: "Category doctors",
            data: doctorsByCategory,
            success: true,
            error: false
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = getCategoryDoctors;
