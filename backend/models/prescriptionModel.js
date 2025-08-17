const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linked to User collection
    patientName: { type: String, required: true },
    date: { type: Date, default: Date.now }, // When the prescription was created
    prescriptionImage: { type: String, required: true }, // Base64 image string
}, {
    timestamps: true // Automatically adds createdAt & updatedAt
});

const PrescriptionModel = mongoose.model('Prescription', prescriptionSchema);

module.exports = PrescriptionModel;
