const SOS = require("../models/sos");


// Create SOS
exports.createSOS = async (req, res) => {
    try {

        const sos = await SOS.create(req.body);

        res.status(201).json({
            success: true,
            message: "SOS request submitted successfully",
            sos,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Get All SOS Requests
exports.getAllSOS = async (req, res) => {
    try {

        const sosRequests = await SOS.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sosRequests.length,
            sosRequests,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Get SOS By Id
exports.getSOSById = async (req, res) => {
    try {

        const sos = await SOS.findById(
            req.params.id
        );

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: "SOS request not found",
            });
        }

        res.status(200).json({
            success: true,
            sos,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Update SOS Status
exports.updateSOSStatus = async (
    req,
    res
) => {
    try {

        const sos = await SOS.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            {
                new: true,
            }
        );

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: "SOS request not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "SOS status updated successfully",
            sos,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
