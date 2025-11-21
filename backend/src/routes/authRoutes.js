const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Dealer = require('../models/Dealer');

// --- USER REGISTER (simple)
router.post(
    '/register', [
        body('name').notEmpty(),
        body('mobile').notEmpty(),
        body('rationCardNumber').notEmpty(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, mobile, rationCardNumber, address, familyMembers } = req.body;

        try {
            let existing = await User.findOne({ $or: [{ mobile }, { rationCardNumber }] });
            if (existing) return res.status(400).json({ msg: 'User already exists' });

            const user = new User({
                name,
                mobile,
                rationCardNumber,
                address,
                familyMembers,
                remainingQuota: {
                    riceKg: 5,
                    wheatKg: 5,
                    sugarKg: 1,
                    oilL: 1
                }
            });

            await user.save();

            const payload = { user: { id: user.id, role: user.role } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

            res.json({ token, user });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
);

// --- USER LOGIN (basic by mobile for now)
router.post('/login', [body('mobile').notEmpty()], async(req, res) => {
    const { mobile } = req.body;
    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;