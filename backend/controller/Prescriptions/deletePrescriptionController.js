const PrescriptionModel = require("../../models/prescriptionModel");

const deletePrescriptionController = async (req, res) => {
    try {
        const deletedPrescription = await PrescriptionModel.findByIdAndDelete(req.params.id);

        if (!deletedPrescription) {
            return res.status(404).json({
                message: "Prescription not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Prescription deleted successfully",
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

module.exports = deletePrescriptionController;
