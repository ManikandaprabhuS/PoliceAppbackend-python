const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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