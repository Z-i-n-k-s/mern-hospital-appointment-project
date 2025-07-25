const uploadpermission = require("../../helpers/permission");
const DoctorModel = require("../../models/doctorModel");

async function updateDoctorController(req, res) {
    try {
        if (!uploadpermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id, ...resBody } = req.body;
        const updateDoctor = await DoctorModel.findByIdAndUpdate(_id, resBody, { new: true });

        res.json({
            message: "Doctor updated successfully",
            data: updateDoctor,
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
}

module.exports = updateDoctorController;
