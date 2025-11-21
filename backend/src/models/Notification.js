const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who posted
    createdAt: { type: Date, default: Date.now },
    visibleTo: { type: [String], default: ["user", "dealer"] }, // roles
});

module.exports = mongoose.model("Notification", notificationSchema);