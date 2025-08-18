const AppointmentModel = require("../../models/appointmentModel");

// Confirm Appointment with Payment
async function confirmAppointmentController(req, res) {
    try {
        const { _id, fee } = req.body;

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            _id,
            {
                status: "Confirmed",
                paymentStatus: "Paid",
                fee
            },
            { new: true }
        );

        res.json({
            message: "Appointment confirmed and payment completed",
            data: updatedAppointment,
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

module.exports = confirmAppointmentController;
