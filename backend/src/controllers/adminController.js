const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const Admin = require("../models/Admin");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({
            email: email.toLowerCase(),
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                adminId: admin._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.profile = async (req, res) => {
    try {
        const admin = await Admin.findById(
            req.admin.adminId
        ).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admin = await Admin.findById(
            req.admin.adminId
        );

        const isMatch = await bcrypt.compare(
            oldPassword,
            admin.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        admin.password = hashedPassword;

        await admin.save();

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const hashedOtp = await bcrypt.hash(
            otp,
            10
        );

        admin.resetOtp = hashedOtp;
        admin.resetOtpExpiry =
            Date.now() + 10 * 60 * 1000;

        await admin.save();

        await sendEmail(
            email,
            "Password Reset OTP",
            `
        <h2>Police Directory</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `
        );

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const admin = await Admin.findOne({
            email,
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        if (
            !admin.resetOtp ||
            !admin.resetOtpExpiry
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP not generated",
            });
        }

        if (
            admin.resetOtpExpiry < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        const isMatch = await bcrypt.compare(
            otp,
            admin.resetOtp
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP verified",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.resetPassword = async (
    req,
    res
) => {
    try {
        const {
            email,
            otp,
            newPassword,
        } = req.body;

        const admin = await Admin.findOne({
            email,
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        if (
            admin.resetOtpExpiry < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        const isMatch = await bcrypt.compare(
            otp,
            admin.resetOtp
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        admin.password = hashedPassword;

        admin.resetOtp = null;
        admin.resetOtpExpiry = null;

        await admin.save();

        res.status(200).json({
            success: true,
            message:
                "Password reset successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};