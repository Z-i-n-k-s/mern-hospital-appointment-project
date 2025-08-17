const PrescriptionModel = require("../../models/prescriptionModel");

const createPrescriptionController = async (req, res) => {
    try {
        const newPrescription = new PrescriptionModel(req.body);
        const savedPrescription = await newPrescription.save();

        res.json({
            message: "Prescription created successfully",
            data: savedPrescription,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = createPrescriptionController;
