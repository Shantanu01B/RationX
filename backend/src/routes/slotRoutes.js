const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const SlotBooking = require('../models/SlotBooking');
const User = require('../models/User');
const getCurrentMonth = require('../utils/getMonth');


// ======================================================================
// ⭐ 1) User books a slot
// ======================================================================
router.post('/book', auth, role(['user']), async(req, res) => {
    try {
        const { dealerId, date, timeSlot } = req.body;
        const month = getCurrentMonth();

        // Check if user already booked this month
        const existing = await SlotBooking.findOne({ userId: req.user.id, month });
        if (existing) return res.status(400).json({ msg: 'Already booked a slot this month' });

        // Check max users per slot
        const maxPerSlot = 10;
        const slotCount = await SlotBooking.countDocuments({ dealerId, date, timeSlot });
        if (slotCount >= maxPerSlot) {
            return res.status(400).json({ msg: 'Slot full, choose another time' });
        }

        const booking = new SlotBooking({
            userId: req.user.id,
            dealerId,
            date,
            timeSlot,
            month
        });

        await booking.save();
        res.json({ msg: 'Slot booked successfully', booking });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


// ======================================================================
// ⭐ 2) Dealer views booked slots (UPDATED)
// ======================================================================
router.get('/dealer/:dealerId', auth, role(['dealer']), async(req, res) => {
    try {
        const { dealerId } = req.params;

        const slots = await SlotBooking
            .find({ dealerId })
            .populate('userId', 'name mobile lastDistributionMonth') // <--- UPDATED
            .sort({ date: 1, timeSlot: 1 }); // <--- SORTING

        res.json(slots);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


// ======================================================================
// ⭐ 3) User views their booked slot
// ======================================================================
router.get('/my-slot', auth, role(['user']), async(req, res) => {
    try {
        const month = getCurrentMonth();

        const booking = await SlotBooking
            .findOne({ userId: req.user.id, month })
            .populate('dealerId', 'name shopNumber');

        if (!booking) {
            return res.json({ msg: 'No slot booked yet' });
        }

        res.json(booking);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


// ======================================================================
// ⭐ 4) User fetches all dealers (for slot booking)
// ======================================================================
router.get('/all-dealers', auth, role(['user']), async(req, res) => {
    try {
        const dealers = await User.find({ role: 'dealer' })
            .select('name shopNumber address mobile');

        res.json({ dealers });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error fetching dealers' });
    }
});


// ======================================================================
// ⭐ 5) Check Real-Time Slot Availability
// ======================================================================
router.get('/check-availability', auth, role(['user']), async(req, res) => {
    try {
        const { dealerId, date } = req.query;

        if (!dealerId || !date) {
            return res.status(400).json({ msg: "Dealer and Date required" });
        }

        const bookings = await SlotBooking.find({ dealerId, date });

        const slotCounts = {};
        bookings.forEach(b => {
            slotCounts[b.timeSlot] = (slotCounts[b.timeSlot] || 0) + 1;
        });

        res.json(slotCounts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error checking slots" });
    }
});


// ======================================================================
// EXPORT ROUTER
// ======================================================================
module.exports = router;