const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(mongoUri); // No options needed in Mongoose v7+
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;