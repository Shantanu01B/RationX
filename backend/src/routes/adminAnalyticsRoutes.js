// backend/src/routes/adminAnalyticsRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const User = require("../models/User");
const DealerStock = require("../models/DealerStock");
const Complaint = require("../models/Complaint");

const getCurrentMonth = require("../utils/getMonth");

/**
 * ============================================================
 * ⭐ USERS SERVED PER DEALER (Dealer-First + Show 0 Stock)
 * ============================================================
 */
router.get("/users-served", auth, role(["admin"]), async(req, res) => {
    try {
        const month = getCurrentMonth();

        // 1️⃣ Get ALL dealers (even if no stock assigned yet)
        const allDealers = await User.find({ role: "dealer" }).select("name _id");

        // 2️⃣ For each dealer, try to find their stock for THIS month
        const report = await Promise.all(
            allDealers.map(async(dealer) => {
                const stockRecord = await DealerStock.findOne({
                    dealerId: dealer._id,
                    month: month,
                });

                return {
                    dealerId: dealer._id,
                    dealerName: dealer.name,
                    month: month,

                    distributedRiceKg: stockRecord ? stockRecord.stock.riceKg : 0,
                    distributedWheatKg: stockRecord ? stockRecord.stock.wheatKg : 0,
                    distributedSugarKg: stockRecord ? stockRecord.stock.sugarKg : 0,
                    distributedOilL: stockRecord ? stockRecord.stock.oilL : 0,

                    status: stockRecord ? "Active" : "No Stock Assigned",
                };
            })
        );

        res.json({ month, report });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ msg: "Server error fetching analytics" });
    }
});

/**
 * ============================================================
 * ⭐ COMPLAINT STATS
 * ============================================================
 */
router.get("/complaints", auth, role(["admin"]), async(req, res) => {
    try {
        const total = await Complaint.countDocuments();
        const pending = await Complaint.countDocuments({ status: "pending" });
        const resolved = await Complaint.countDocuments({ status: "resolved" });

        res.json({ total, pending, resolved });
    } catch (err) {
        console.error("Complaint Stats Error:", err);
        res.status(500).json({ msg: "Server error fetching complaints stats" });
    }
});

module.exports = router;