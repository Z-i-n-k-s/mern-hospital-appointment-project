const AppointmentModel = require("../../models/appointmentModel");

// Get All Appointments by Patient
async function getAppointmentsByPatientController(req, res) {
    try {
        const { userId } = req.body;

        const appointments = await AppointmentModel.find({ userId });

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

module.exports = getAppointmentsByPatientController;
