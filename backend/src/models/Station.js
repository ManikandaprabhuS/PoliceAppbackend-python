const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
    {
        districtId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "District",
            required: true,
        },

        stationName: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            default: 0,
        },

        longitude: {
            type: Number,
            default: 0,
        },

        primaryOfficerName: {
            type: String,
            required: true,
        },

        primaryOfficerPhone: {
            type: String,
            required: true,
        },

        nightOfficerName: {
            type: String,
            default: "",
        },

        nightOfficerPhone: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Station",
    stationSchema
);