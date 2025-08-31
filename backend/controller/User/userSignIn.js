const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const DoctorModel = require('../../models/doctorModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) throw new Error("Please provide email");
        if (!password) throw new Error("Please provide password");

        // Try to find user first
        let user = await userModel.findOne({ email });
        let role;
        let isValidPassword = false;

        if (user) {
            role = user.role; // get role from user model
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            // If not found in users, try doctor
            user = await DoctorModel.findOne({ email });
            if (!user) throw new Error("User not found");

            role = 'DOCTOR';
            isValidPassword = password === user.password; // plain string compare for doctors
        }

        if (!isValidPassword) throw new Error("Please check password");

        // Create JWT
        const tokenData = {
            _id: user._id,
            email: user.email,
            role: role
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        // Cookie options
        const tokenOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        res.cookie("token", token, tokenOption).status(200).json({
            message: "Login successfully",
            data: {
                token,
                role
            },
            success: true,
            error: false
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = userSignInController;
