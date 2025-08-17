const mongoose = require("mongoose");

const healthTipsSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,   // store doctorId as string
      required: true,
    },
    doctorName: {
      type: String,
       trim: true,   // store doctorName as string
      required: true,
    },
    patient: {
      type: String,   // store patientId as string
      required: true,
    },
    patientName: {
      type: String,   // store patient's display name
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const HealthTipsModel = mongoose.model("HealthTip", healthTipsSchema);

module.exports = HealthTipsModel;
