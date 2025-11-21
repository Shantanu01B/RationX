const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Ensure this matches your actual model filename (e.g., Notification.js or notifications.js)
const Notification = require("../models/Notification");

// --------------------------------------------------------------------------
// 1. Admin Creates a Notification
// --------------------------------------------------------------------------
router.post("/", auth, role(["admin"]), async(req, res) => {
    try {
        const { title, message, visibleTo } = req.body;

        const notification = new Notification({
            title,
            message,
            createdBy: req.user.id,
            // Default to showing to both users and dealers if not specified
            visibleTo: visibleTo || ["user", "dealer"]
        });

        await notification.save();
        res.json({ msg: "Notification created", notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// --------------------------------------------------------------------------
// 2. Users/Dealers Fetch Notifications (Auto-hide older than 7 days)
// --------------------------------------------------------------------------
router.get("/", auth, async(req, res) => {
    try {
        // Calculate the date for "7 Days Ago"
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const notifications = await Notification.find({
            // Match the user's role (user or dealer)
            visibleTo: req.user.role,

            // FIX: Only show notifications created AFTER the 7-day cutoff
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: -1 }); // Newest first

        res.json({ notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;