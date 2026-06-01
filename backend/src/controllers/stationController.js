const Station = require("../models/Station");

exports.createStation = async (req, res) => {
    try {
        const station = await Station.create(req.body);

        res.status(201).json({
            success: true,
            message: "Station created successfully",
            station,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getStations = async (req, res) => {
    try {
        const stations = await Station.find({
            isActive: true,
        }).populate("districtId", "districtName");

        res.json({
            success: true,
            count: stations.length,
            stations,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getStationById = async (req, res) => {
    try {
        const station = await Station.findById(
            req.params.id
        ).populate("districtId", "districtName");

        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Station not found",
            });
        }

        res.json({
            success: true,
            station,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getStationsByDistrict = async (req, res) => {
    try {
        const stations = await Station.find({
            districtId: req.params.districtId,
            isActive: true,
        });

        res.json({
            success: true,
            count: stations.length,
            stations,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateStation = async (req, res) => {
    try {
        const station =
            await Station.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );

        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Station not found",
            });
        }

        res.json({
            success: true,
            message: "Station updated successfully",
            station,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.deleteStation = async (req, res) => {
    try {
        const station =
            await Station.findByIdAndDelete(
                req.params.id
            );

        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Station not found",
            });
        }

        res.json({
            success: true,
            message: "Station deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};