const District = require("../models/District");
const Station = require("../models/Station");

exports.globalSearch = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query required",
            });
        }

        const districts = await District.find({
            districtName: {
                $regex: q,
                $options: "i",
            },
        });

        const stations = await Station.find({
            stationName: {
                $regex: q,
                $options: "i",
            },
        }).populate("districtId", "districtName");

        res.json({
            success: true,
            districts,
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