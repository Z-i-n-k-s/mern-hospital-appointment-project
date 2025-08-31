// controllers/announcement/createAnnouncementController.js
const AnnouncementModel = require("../../models/announcementModel");

const createAnnouncementController = async (req, res) => {
  try {
    const { title, noticeText, imageBase64, createdBy } = req.body;

    if (!title || !createdBy) {
      return res.status(400).json({ success: false, message: "Title and createdBy are required" });
    }

    const announcement = new AnnouncementModel({
      title,
      noticeText: noticeText || '',
      imageBase64: imageBase64 || '',
      createdBy
    });

    const savedAnnouncement = await announcement.save();
    res.json({ success: true, message: "Announcement created successfully", data: savedAnnouncement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = createAnnouncementController;
