const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/admin/auth/login
router.post(
    '/login', [
        body('username').notEmpty(),
        body('password').notEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;

        try {
            const admin = await Admin.findOne({ username });
            if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

            const isMatch = await admin.comparePassword(password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            // FIX: Use 'user' key so the auth middleware works correctly
            const payload = { user: { id: admin._id, role: 'admin' } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ token, admin: { id: admin._id, username: admin.username } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

module.exports = router;