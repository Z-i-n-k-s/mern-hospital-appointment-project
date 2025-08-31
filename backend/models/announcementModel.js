const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    noticeText: {
      type: String,
      default: '', // Optional text notice
    },
    imageBase64: {
      type: String,
      default: '', // Optional image in base64
    },
    createdBy: {
      type: String,
      ref: 'user', // Reference to admin/user who created it
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Can be used to hide old announcements
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const AnnouncementModel = mongoose.model('announcement', announcementSchema);

module.exports = AnnouncementModel;
