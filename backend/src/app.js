const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const adminRoutes = require("./routes/adminRoutes");
const districtRoutes = require("./routes/districtRoutes");
const stationRoutes = require("./routes/stationRoutes");
const searchRoutes = require("./routes/searchRoutes");
const importRoutes = require("./routes/importRoutes");
const sosRoutes =
    require("./routes/sosRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/stations", stationRoutes);
app.use(
    "/api/search",
    searchRoutes
);
app.use("/api/import", importRoutes);
app.use("/api/sos", sosRoutes);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Police Directory API Running",
    });
});

module.exports = app;