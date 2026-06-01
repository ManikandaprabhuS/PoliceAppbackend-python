const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    createStation,
    getStations,
    getStationById,
    getStationsByDistrict,
    updateStation,
    deleteStation,
} = require("../controllers/stationController");

router.post(
    "/",
    authMiddleware,
    createStation
);

router.get("/", getStations);

router.get(
    "/district/:districtId",
    getStationsByDistrict
);

router.get("/:id", getStationById);

router.put(
    "/:id",
    authMiddleware,
    updateStation
);

router.delete(
    "/:id",
    authMiddleware,
    deleteStation
);

module.exports = router;