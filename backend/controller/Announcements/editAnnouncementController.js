// controllers/announcement/editAnnouncementController.js
const AnnouncementModel = require("../../models/announcementModel");

const editAnnouncementController = async (req, res) => {
  try {
    const { id, title, noticeText, imageBase64, isActive } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Announcement ID is required" });

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      id,
      { 
        ...(title !== undefined && { title }),
        ...(noticeText !== undefined && { noticeText }),
        ...(imageBase64 !== undefined && { imageBase64 }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, message: "Announcement updated successfully", data: updatedAnnouncement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = editAnnouncementController;
