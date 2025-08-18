const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },         
    userName: { type: String, required: true },       
    doctorId: { type: String, required: true },       
    doctorName: { type: String, required: true },     

    appointmentDate: { type: Date, required: true },  
    appointmentTime: { type: String, required: true },

    reason: { type: String },                         
    status: {                                         
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending"
    },                      
    fee: { type: Number },                            
    paymentStatus: { 
        type: String, 
        enum: ["Unpaid", "Paid","Refunded"], 
        default: "Unpaid" 
    }
}, {
    timestamps: true
});

const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = AppointmentModel;
