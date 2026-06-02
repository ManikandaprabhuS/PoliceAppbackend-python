const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { importStations } = require("../controllers/importController");

router.post(
    "/stations",
    authMiddleware,
    upload.single("file"),
    importStations
);

module.exports = router;