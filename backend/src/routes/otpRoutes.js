const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// QR + Encrypt Helpers
const QRCode = require('qrcode');
const { encrypt } = require('../utils/qrCrypto');

// Models
const User = require('../models/User');
const Otp = require('../models/Otp');

// Environment Variables
const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10);
const OTP_RESEND_COOLDOWN_SECONDS = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);
const OTP_MAX_VERIFY_ATTEMPTS = parseInt(process.env.OTP_MAX_VERIFY_ATTEMPTS || '5', 10);

// Twilio Setup (Optional)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// OTP generator
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// SMS Sender (Twilio or Dev Fallback)
async function sendOtpSms(mobile, otp) {
    if (twilioClient && process.env.TWILIO_FROM_NUMBER) {
        try {
            await twilioClient.messages.create({
                body: `Your RationX OTP is ${otp}. It expires in ${OTP_EXPIRES_MINUTES} minutes.`,
                from: process.env.TWILIO_FROM_NUMBER,
                to: mobile
            });
            return { sent: true };
        } catch (err) {
            console.error("Twilio send error:", err.message || err);
            return { sent: false, error: err.message };
        }
    }

    console.log(`DEV OTP for ${mobile}: ${otp}`);
    return { sent: true, dev: true };
}

/* ---------------------------------------------
   POST /request-otp
   User must exist + must be active
---------------------------------------------- */
router.post(
    "/request-otp", [body("mobile").notEmpty().trim()],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { mobile } = req.body;

        try {
            // ✔ USER MUST EXIST
            const userExists = await User.findOne({ mobile });
            if (!userExists) {
                return res.status(404).json({
                    msg: "Mobile number not registered. Please Register first."
                });
            }

            // ⭐ NEW: **BLOCK DEACTIVATED USERS**
            if (userExists.isActive === false) {
                return res.status(403).json({
                    msg: "Your account has been deactivated. Contact Admin."
                });
            }
            // ⭐ END BLOCK

            const now = new Date();
            let otpDoc = await Otp.findOne({ mobile });

            // Cooldown
            if (otpDoc) {
                const secondsSinceLast = Math.floor(
                    (now - new Date(otpDoc.lastSentAt)) / 1000
                );

                if (secondsSinceLast < OTP_RESEND_COOLDOWN_SECONDS) {
                    return res.status(429).json({
                        msg: `Please wait ${
                            OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast
                        }s before requesting a new OTP`
                    });
                }
            }

            const otp = generateOtp();
            const salt = await bcrypt.genSalt(10);
            const otpHash = await bcrypt.hash(otp, salt);
            const expiresAt = new Date(
                now.getTime() + OTP_EXPIRES_MINUTES * 60 * 1000
            );

            if (otpDoc) {
                otpDoc.otpHash = otpHash;
                otpDoc.expiresAt = expiresAt;
                otpDoc.lastSentAt = now;
                otpDoc.attempts = 0;
                await otpDoc.save();
            } else {
                otpDoc = new Otp({
                    mobile,
                    otpHash,
                    createdAt: now,
                    expiresAt,
                    lastSentAt: now
                });
                await otpDoc.save();
            }

            const sendResult = await sendOtpSms(mobile, otp);

            return res.json({
                msg: "OTP sent",
                debugOtp: otp, // REMOVE IN PROD
                sendResult: sendResult.dev ?
                    { dev: true } :
                    { sent: sendResult.sent }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: "Server error" });
        }
    }
);

/* ---------------------------------------------
   POST /verify-otp
---------------------------------------------- */
router.post(
    "/verify-otp", [
        body("mobile").notEmpty().trim(),
        body("otp").notEmpty().trim(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { mobile, otp } = req.body;

        try {
            const otpDoc = await Otp.findOne({ mobile });
            if (!otpDoc)
                return res.status(400).json({ msg: "No OTP requested for this mobile" });

            if (new Date() > otpDoc.expiresAt) {
                await Otp.deleteOne({ _id: otpDoc._id });
                return res.status(400).json({ msg: "OTP expired. Please request again." });
            }

            if (otpDoc.attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
                await Otp.deleteOne({ _id: otpDoc._id });
                return res.status(429).json({ msg: "Too many incorrect attempts." });
            }

            const validOtp = await bcrypt.compare(otp, otpDoc.otpHash);
            if (!validOtp) {
                otpDoc.attempts++;
                await otpDoc.save();
                return res.status(400).json({ msg: "Invalid OTP" });
            }

            await Otp.deleteOne({ _id: otpDoc._id });

            let user = await User.findOne({ mobile });
            if (!user) {
                return res.status(400).json({ msg: "User not found. Please register." });
            }

            // QR Generation
            if (!user.qrCode || !user.qrEncryptedId) {
                try {
                    const encryptedId = encrypt(user._id.toString());
                    const qrImage = await QRCode.toDataURL(encryptedId);

                    user.qrEncryptedId = encryptedId;
                    user.qrCode = qrImage;
                    await user.save();
                } catch (err) {
                    console.error("QR Error:", err);
                }
            }

            const payload = { user: { id: user.id, role: user.role } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            });

            return res.json({ token, user });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: "Server error" });
        }
    }
);

module.exports = router;