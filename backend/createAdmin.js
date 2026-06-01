const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

dotenv.config();

const Admin = require("./src/models/Admin");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await Admin.findOne({
            email: adminEmail,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        await Admin.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
        });

        console.log("Admin Created Successfully");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createAdmin();