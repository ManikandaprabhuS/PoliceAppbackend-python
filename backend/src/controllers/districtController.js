const District = require("../models/District");

exports.createDistrict = async (req, res) => {
    try {
        const { districtName } = req.body;

        const existingDistrict =
            await District.findOne({
                districtName,
            });

        if (existingDistrict) {
            return res.status(400).json({
                success: false,
                message: "District already exists",
            });
        }

        const district = await District.create({
            districtName,
        });

        res.status(201).json({
            success: true,
            message: "District created successfully",
            district,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const districts = await District.find({
            isActive: true,
        }).sort({
            districtName: 1,
        });

        res.json({
            success: true,
            count: districts.length,
            districts,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateDistrict = async (req, res) => {
    try {
        const district = await District.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!district) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        res.json({
            success: true,
            message: "District updated successfully",
            district,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.deleteDistrict = async (req, res) => {
    try {
        const district = await District.findByIdAndDelete(
            req.params.id
        );

        if (!district) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        res.json({
            success: true,
            message: "District deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};