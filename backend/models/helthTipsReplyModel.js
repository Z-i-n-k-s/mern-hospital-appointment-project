const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    healthTipId: {
      type: String, // reference to the health tip
      ref: "HealthTip",
      required: true,
    },
    doctor: {
      type: String, // store doctorId as string
      required: true,
    },
    doctorName: {
      type: String,
      trim: true,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const ReplyModel = mongoose.model("Reply", replySchema);

module.exports = ReplyModel;
