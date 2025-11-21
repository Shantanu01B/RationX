const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Middleware
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Models & Utils
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/qrCrypto');
const getCurrentMonth = require('../utils/getMonth');

/**
 * @route   POST /api/qr/generate
 * @desc    Generate new QR code for logged-in user
 * @access  Private (User)
 */
router.post('/generate', auth, role(['user']), async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const month = getCurrentMonth(); // e.g., "2025-11"

        // FIX: Use '|' instead of '-' to avoid conflict with the date format (2025-11)
        const qrData = `${user._id}|${month}|${Date.now()}`; // unique per month

        const encrypted = encrypt(qrData);
        const qrCodeImage = await QRCode.toDataURL(encrypted);

        // save in user
        user.qrCode = qrCodeImage;
        user.qrEncryptedId = encrypted;
        await user.save();

        res.json({ msg: "QR generated", qrCode: qrCodeImage, encryptedId: encrypted });
    } catch (err) {
        console.error("QR Generation Error:", err.message);
        res.status(500).json({ msg: "Server error generating QR" });
    }
});

/**
 * @route   GET /api/qr/my-qr
 * @desc    Get logged-in user's QR code
 * @access  Private (User)
 */
router.get('/my-qr', auth, role(['user']), async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("qrCode qrEncryptedId");

        if (!user) return res.status(404).json({ msg: "User not found" });
        if (!user.qrCode) return res.status(400).json({ msg: "QR code not generated yet" });

        res.json({
            qrCode: user.qrCode,
            encryptedId: user.qrEncryptedId
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

/**
 * @route   POST /api/qr/scan
 * @desc    Dealer scans user QR
 * @access  Private (Dealer)
 */
router.post('/scan', auth, role(['dealer']), async(req, res) => {
    try {
        const { scannedData } = req.body;
        if (!scannedData) return res.status(400).json({ msg: "No scanned data provided" });

        // Decrypt QR
        const decrypted = decrypt(scannedData);
        if (!decrypted) return res.status(400).json({ msg: "Invalid or corrupted QR code" });

        // FIX: Split by '|' to correctly separate the ID and the Date
        const [userId, qrMonth, timestamp] = decrypted.split('|');

        const user = await User.findById(userId).select("name mobile rationCardNumber remainingQuota lastDistributionMonth");

        if (!user) return res.status(404).json({ msg: "User not found" });

        const currentMonth = getCurrentMonth();

        // Compare the month from QR with current server month
        if (qrMonth !== currentMonth) return res.status(400).json({ msg: "QR expired for this month" });

        // Optional: check if user already received ration
        if (user.lastDistributionMonth === currentMonth) {
            return res.status(400).json({ msg: "User already collected ration this month" });
        }

        res.json({
            msg: "QR Verified Successfully",
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                remainingQuota: user.remainingQuota
            }
        });
    } catch (err) {
        console.error("QR Scan Error:", err.message);
        res.status(500).json({ msg: "Server error processing QR" });
    }
});

module.exports = router;