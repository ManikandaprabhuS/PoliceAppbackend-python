const express = require("express");

const router = express.Router();

const {
    createSOS,
    getAllSOS,
    getSOSById,
    updateSOSStatus,
} = require("../controllers/sosController");

router.post("/", createSOS);

router.get("/", getAllSOS);

router.get("/:id", getSOSById);

router.put(
    "/:id/status",
    updateSOSStatus
);

module.exports = router;