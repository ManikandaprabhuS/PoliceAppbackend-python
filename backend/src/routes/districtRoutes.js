const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    createDistrict,
    getDistricts,
    updateDistrict,
    deleteDistrict,
} = require("../controllers/districtController");

router.post(
    "/",
    authMiddleware,
    createDistrict
);

router.get(
    "/",
    getDistricts
);

router.put(
    "/:id",
    authMiddleware,
    updateDistrict
);

router.delete(
    "/:id",
    authMiddleware,
    deleteDistrict
);

module.exports = router;