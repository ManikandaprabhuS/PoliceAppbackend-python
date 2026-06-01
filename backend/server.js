require("dotenv").config();

console.log("Mongo URI:", process.env.MONGODB_URI);

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});