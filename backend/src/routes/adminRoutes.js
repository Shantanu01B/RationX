const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');

// ======================================================================
// ✅ 1) Create Dealer (Admin Only)
// ======================================================================
router.post('/create-dealer', auth, role(['admin']), async(req, res) => {
    try {
        const { name, mobile, shopNumber, address } = req.body;

        // Check if mobile exists
        const userExists = await User.findOne({ mobile });
        if (userExists) {
            return res.status(400).json({ msg: 'User/Dealer already exists with this mobile' });
        }

        // Create dealer
        const dealer = new User({
            name,
            mobile,
            rationCardNumber: `DEALER-${mobile}`,
            role: 'dealer',
            shopNumber,
            address: {
                line1: address || shopNumber || "Shop Address",
                city: "Local",
                state: "State",
                pincode: "000000"
            },
            remainingQuota: {
                riceKg: 0,
                wheatKg: 0,
                sugarKg: 0,
                oilL: 0
            }
        });

        await dealer.save();
        res.json({ msg: 'Dealer created successfully', dealer });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message || 'Server error' });
    }
});

// ======================================================================
// 2) Promote user to admin
// ======================================================================
router.post('/promote-admin', auth, role(['admin']), async(req, res) => {
    try {
        const { mobile } = req.body;

        const user = await User.findOneAndUpdate({ mobile }, { role: 'admin' }, { new: true });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({ msg: 'Promoted to Admin', user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ======================================================================
// 3) List all users
// ======================================================================
router.get('/all-users', auth, role(['admin']), async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ======================================================================
// 4) List all dealers
// ======================================================================
router.get('/all-dealers', auth, role(['admin']), async(req, res) => {
    try {
        const dealers = await User.find({ role: 'dealer' }).select('-password');
        res.json({ dealers });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ======================================================================
// ⭐ 5) TOGGLE USER ACTIVE/DEACTIVE STATUS (NEW)
// ======================================================================
router.post('/toggle-status', auth, role(['admin']), async(req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // If undefined treat as true → flip to false
        const currentStatus = user.isActive === undefined ? true : user.isActive;

        user.isActive = !currentStatus;
        await user.save();

        res.json({
            msg: `User ${user.isActive ? 'Activated' : 'Deactivated'} successfully`,
            isActive: user.isActive
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;