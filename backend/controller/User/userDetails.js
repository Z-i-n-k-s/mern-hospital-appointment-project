const userModel = require('../../models/userModel');
const DoctorModel = require('../../models/doctorModel');

async function userDetailsController(req, res) {
    try {
        console.log("user id:", req.userId);

        // Try to find in users first
        let data = await userModel.findById(req.userId);

        if (!data) {
            // If not found in users, check doctors
            const doctor = await DoctorModel.findById(req.userId);
            if (!doctor) {
                return res.status(404).json({
                    message: "User or Doctor not found",
                    error: true,
                    success: false
                });
            }

            // Only send selected fields for doctor
            data = {
                _id: doctor._id,
                createdAt: doctor.createdAt,
                email: doctor.email,
                name: doctor.fullName,
                password: doctor.password,
                profilePic: doctor.profileImage || null,
                role: "DOCTOR",
                __v: doctor.__v
            };
        }

        res.status(200).json({
            data: data,
            error: false,
            success: true,
            message: "User details"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = userDetailsController;
