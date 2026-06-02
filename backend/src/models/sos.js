const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        message: {
            type: String,
            default: "Emergency Assistance Needed",
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SOS", sosSchema);