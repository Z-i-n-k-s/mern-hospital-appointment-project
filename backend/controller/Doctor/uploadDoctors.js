const uploadpermission = require("../../helpers/permission");
const DoctorModel = require("../../models/doctorModel");

async function uploadDoctorController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!uploadpermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const newDoctor = new DoctorModel(req.body);
        const savedDoctor = await newDoctor.save();

        res.status(201).json({
            message: "Doctor uploaded successfully",
            data: savedDoctor,
            error: false,
            success: true,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = uploadDoctorController;
