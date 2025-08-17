const PrescriptionModel = require("../../models/prescriptionModel");

const updatePrescriptionController = async (req, res) => {
    try {
        const updatedPrescription = await PrescriptionModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedPrescription) {
            return res.status(404).json({
                message: "Prescription not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Prescription updated successfully",
            data: updatedPrescription,
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

module.exports = updatePrescriptionController;
