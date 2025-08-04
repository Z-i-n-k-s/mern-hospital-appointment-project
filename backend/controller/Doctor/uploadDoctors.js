const uploadpermission = require("../../helpers/permission");
const DoctorModel = require("../../models/doctorModel");

async function uploadDoctorController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check permission
        if (!uploadpermission(sessionUserId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false,
            });
        }

        // Validate required fields manually if needed
        const requiredFields = ["fullName", "category", "email", "phone", "password"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    message: `Missing required field: ${field}`,
                    error: true,
                    success: false,
                });
            }
        }

        // Create and save the doctor
        const newDoctor = new DoctorModel(req.body);
        const savedDoctor = await newDoctor.save();

        // To avoid sending password back in response
        const { password, ...doctorDataWithoutPassword } = savedDoctor.toObject();

        res.status(201).json({
            message: "Doctor uploaded successfully",
            data: doctorDataWithoutPassword,
            error: false,
            success: true,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || String(err),
            error: true,
            success: false,
        });
    }
}

module.exports = uploadDoctorController;
