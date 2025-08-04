const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,   // store doctorId as string
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

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
