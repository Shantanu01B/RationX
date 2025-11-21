const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
    // FIX: Removed "index: true" from here because it is defined at the bottom
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now }
});

// This handles the auto-delete (TTL) logic. This is the only index definition we need for this field.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);