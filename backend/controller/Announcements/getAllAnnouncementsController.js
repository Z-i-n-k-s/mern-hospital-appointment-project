// controllers/announcement/getAllAnnouncementsController.js
const AnnouncementModel = require("../../models/announcementModel");

const getAllAnnouncementsController = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Announcements fetched successfully", data: announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = getAllAnnouncementsController;
