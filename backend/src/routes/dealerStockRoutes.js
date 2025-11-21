const express = require("express");
const router = express.Router();

const DealerStock = require("../models/DealerStock");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const SlotBooking = require("../models/SlotBooking"); // <--- IMPORTANT
const role = require("../middleware/role");
const auth = require("../middleware/auth");
const getCurrentMonth = require("../utils/getMonth");


// ----------------------------------------------------
// 1) ADMIN adds monthly stock
// ----------------------------------------------------
router.post("/add-stock", auth, role(["admin"]), async(req, res) => {
    try {
        const { dealerId, stock } = req.body;
        const month = getCurrentMonth();

        let existing = await DealerStock.findOne({ dealerId, month });
        if (existing) {
            return res.status(400).json({ msg: "Stock for this month already added" });
        }

        const newStock = new DealerStock({ dealerId, month, stock });
        await newStock.save();

        res.json({ msg: "Monthly stock added", stock: newStock });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


// ----------------------------------------------------
// 2) DEALER views their stock
// ----------------------------------------------------
router.get("/my-stock", auth, role(["dealer"]), async(req, res) => {
    try {
        const month = getCurrentMonth();
        const stock = await DealerStock.findOne({ dealerId: req.user.id, month });

        res.json(stock || { msg: "No stock found for this month" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


// ----------------------------------------------------
// 3) DEALER distributes ration  (NOW WITH SLOT CHECK)
// ----------------------------------------------------
router.post("/distribute", auth, role(["dealer"]), async(req, res) => {
    try {
        const { userId, riceKg, wheatKg, sugarKg, oilL } = req.body;
        const month = getCurrentMonth();
        const dealerId = req.user.id;

        // ⭐ STEP 1 — CHECK SLOT BOOKING
        const booking = await SlotBooking.findOne({
            userId,
            dealerId,
            month
        });

        if (!booking) {
            return res.status(400).json({
                msg: "Distribution Failed: User has NOT booked a slot with you for this month."
            });
        }

        // ⭐ STEP 2 — Standard checks
        const dealerStock = await DealerStock.findOne({ dealerId, month });
        if (!dealerStock) return res.status(404).json({ msg: "Stock not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Prevent double distribution
        if (user.lastDistributionMonth === month) {
            return res.status(400).json({ msg: "User already received ration this month" });
        }

        // Check available stock
        if (
            dealerStock.stock.riceKg < riceKg ||
            dealerStock.stock.wheatKg < wheatKg ||
            dealerStock.stock.sugarKg < sugarKg ||
            dealerStock.stock.oilL < oilL
        ) {
            return res.status(400).json({ msg: "Insufficient stock" });
        }

        // ⭐ STEP 3 — Deduct Stock
        dealerStock.stock.riceKg -= riceKg;
        dealerStock.stock.wheatKg -= wheatKg;
        dealerStock.stock.sugarKg -= sugarKg;
        dealerStock.stock.oilL -= oilL;
        await dealerStock.save();

        // Reset quota
        user.remainingQuota.riceKg = 0;
        user.remainingQuota.wheatKg = 0;
        user.remainingQuota.sugarKg = 0;
        user.remainingQuota.oilL = 0;
        user.lastDistributionMonth = month;
        await user.save();

        // ⭐ STEP 4 — SAVE TRANSACTION HISTORY
        const transaction = new Transaction({
            dealerId,
            userId: user._id,
            items: { riceKg, wheatKg, sugarKg, oilL }
        });
        await transaction.save();

        res.json({ msg: "Ration distributed successfully", user, dealerStock });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});


// ----------------------------------------------------
// 4) DEALER HISTORY
// ----------------------------------------------------
router.get("/history", auth, role(["dealer"]), async(req, res) => {
    try {
        const history = await Transaction.find({ dealerId: req.user.id })
            .sort({ date: -1 })
            .populate("userId", "name rationCardNumber");

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error fetching history" });
    }
});

module.exports = router;