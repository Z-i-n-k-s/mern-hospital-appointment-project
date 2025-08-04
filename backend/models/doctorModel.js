const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    category: { type: String, required: true },
    specialization: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    qualification: { type: String },
    experience: { type: Number },
    chamberAddress: { type: String },
    availableDays: [{ type: String }],
    availableTime: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    fee: { type: Number },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    password: { type: String, required: true } // Plain password field
}, {
    timestamps: true
});

const DoctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = DoctorModel;

