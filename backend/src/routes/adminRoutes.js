const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    login,
    profile,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
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

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-otp",
    verifyOtp
);

router.post(
    "/reset-password",
    resetPassword
);

module.exports = router;