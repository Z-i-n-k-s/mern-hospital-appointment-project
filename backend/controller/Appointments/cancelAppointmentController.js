const AppointmentModel = require("../../models/appointmentModel");

// Cancel a Confirmed Appointment
async function cancelAppointmentController(req, res) {
    try {
        const { _id } = req.body;

        const appointment = await AppointmentModel.findById(_id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.status !== "Confirmed") {
            throw new Error("Only confirmed appointments can be cancelled");
        }

        // Update status
        appointment.status = "Cancelled";

        // If already paid, mark as refunded
        if (appointment.paymentStatus === "Paid") {
            appointment.paymentStatus = "Refunded";
        }

        await appointment.save();

        res.json({
            message: "Appointment cancelled successfully",
            data: appointment,
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

module.exports = cancelAppointmentController;
