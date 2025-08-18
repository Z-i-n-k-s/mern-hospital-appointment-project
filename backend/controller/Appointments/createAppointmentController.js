const AppointmentModel = require("../../models/appointmentModel");

// Create Appointment (status = Pending)
async function createAppointmentController(req, res) {
    try {
        const { 
            userId, 
            userName, 
            doctorId, 
            doctorName, 
            appointmentDate, 
            appointmentTime, 
            reason, 
            fee 
        } = req.body;

        // Validation
        if (!userId || !doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                message: "User ID, Doctor ID, appointment date, and time are required",
                error: true,
                success: false
            });
        }

        // Parse the appointment date
        const appointmentDateObj = new Date(appointmentDate);
        
        // Check if the date is valid
        if (isNaN(appointmentDateObj.getTime())) {
            return res.status(400).json({
                message: "Invalid appointment date format",
                error: true,
                success: false
            });
        }

        // Check if appointment date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        appointmentDateObj.setHours(0, 0, 0, 0);
        
        if (appointmentDateObj < today) {
            return res.status(400).json({
                message: "Appointment date must be in the future",
                error: true,
                success: false
            });
        }

        // Check if appointment date is within 30 days
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 30);
        
        if (appointmentDateObj > maxDate) {
            return res.status(400).json({
                message: "Appointments can only be booked up to 30 days in advance",
                error: true,
                success: false
            });
        }

        // Check if patient already has ANY appointment with this specific doctor (regardless of date)
        const existingAppointment = await AppointmentModel.findOne({
            userId,
            doctorId,
            status: { $in: ["Pending", "Confirmed"] } // Only check active appointments
        });

        if (existingAppointment) {
            const existingDate = new Date(existingAppointment.appointmentDate).toLocaleDateString();
            return res.status(400).json({
                message: `You already have a ${existingAppointment.status.toLowerCase()} appointment with Dr. ${doctorName} on ${existingDate}. Please complete or cancel your existing appointment first.`,
                error: true,
                success: false
            });
        }

        // Check if doctor already has an appointment at the same time on the same date
        const doctorTimeConflict = await AppointmentModel.findOne({
            doctorId,
            appointmentDate: appointmentDateObj,
            appointmentTime,
            status: { $in: ["Pending", "Confirmed"] }
        });

        if (doctorTimeConflict) {
            return res.status(400).json({
                message: "This time slot is already booked. Please select a different time.",
                error: true,
                success: false
            });
        }

        // Create new appointment
        const newAppointment = new AppointmentModel({
            userId,
            userName: userName || "Unknown User",
            doctorId,
            doctorName: doctorName || "Unknown Doctor",
            appointmentDate: appointmentDateObj,
            appointmentTime,
            reason: reason?.trim() || "",
            fee: fee || 0,
            status: "Pending",
            paymentStatus: "Unpaid",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedAppointment = await newAppointment.save();

        res.status(201).json({
            message: "Appointment booked successfully",
            data: savedAppointment,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Appointment creation error:", err);
        res.status(500).json({
            message: err.message || "Internal server error while creating appointment",
            error: true,
            success: false
        });
    }
}

module.exports = createAppointmentController;