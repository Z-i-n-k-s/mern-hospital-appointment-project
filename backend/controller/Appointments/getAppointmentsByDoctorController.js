const AppointmentModel = require("../../models/appointmentModel");

// Get All Appointments by Doctor
async function getAppointmentsByDoctorController(req, res) {
    try {
        const { doctorId } = req.body;

        const appointments = await AppointmentModel.find({ doctorId });

        res.json({
            message: "Appointments fetched successfully",
            data: appointments,
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
}

module.exports = getAppointmentsByDoctorController;
