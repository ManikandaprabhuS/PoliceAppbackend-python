const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const adminRoutes = require("./routes/adminRoutes");
const districtRoutes = require("./routes/districtRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/districts", districtRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Police Directory API Running",
    });
});

module.exports = app;