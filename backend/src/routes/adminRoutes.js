const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    login,
    profile,
    changePassword,
} = require("../controllers/adminController");

router.post("/login", login);

router.get(
    "/profile",
    authMiddleware,
    profile
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

module.exports = router;