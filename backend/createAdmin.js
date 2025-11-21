require('dotenv').config();
const mongoose = require('mongoose');
// Check if your folder is named 'Models' or 'models' (case sensitive)
// Based on your backend structure, it's likely inside src/models
const Admin = require('./src/models/Admin');

const createAdmin = async() => {
    try {
        // 1. Connect
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        // 2. CLEANUP: Remove existing 'admin' user to avoid conflicts
        await Admin.deleteOne({ username: "admin" });
        console.log("Removed old admin account (if any).");

        // 3. Create New Admin
        const username = "admin";
        const password = "admin123"; // This password will be hashed by the Schema

        const newAdmin = new Admin({
            username,
            password
        });

        await newAdmin.save();

        console.log("------------------------------------------------");
        console.log("✅ NEW ADMIN CREATED SUCCESSFULLY");
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log("------------------------------------------------");

    } catch (err) {
        console.error("❌ Error creating admin:", err);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();