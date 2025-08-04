// controllers/doctorController.js
const DoctorModel = require("../../models/doctorModel");

const getCategoryDoctors = async (req, res) => {
  try {
    // 1. grab distinct category names
    const categories = await DoctorModel.distinct("category");

    // 2. build an object: { Cardiology: [doc, ...], Dermatology: [doc, ...], … }
    const grouped = {};
    for (const category of categories) {
      // only active doctors in each category
      const docs = await DoctorModel.find({ category, status: 'Active' })
        .select("fullName specialization profileImage fee")  // only pull fields you need
        .lean();
      grouped[category] = docs;
    }

    return res.json({
      message: "Category doctors",
      data: grouped,
      success: true,
      error: false
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryDoctors;

