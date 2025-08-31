// controllers/announcement/deleteAnnouncementController.js
const AnnouncementModel = require("../../models/announcementModel");

const deleteAnnouncementController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Announcement ID is required" });

    const result = await AnnouncementModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = deleteAnnouncementController;
