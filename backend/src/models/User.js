const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    mobile: { type: String, required: true, unique: true },
    rationCardNumber: { type: String, required: true, unique: true },
    address: {
        line1: String,
        city: String,
        state: String,
        pincode: String,
    },
    familyMembers: { type: Number, default: 1 },
    entitlement: {
        riceKg: { type: Number, default: 5 },
        wheatKg: { type: Number, default: 5 },
        sugarKg: { type: Number, default: 1 },
        oilL: { type: Number, default: 1 },
    },
    remainingQuota: {
        riceKg: Number,
        wheatKg: Number,
        sugarKg: Number,
        oilL: Number,
    },
    role: { type: String, enum: ['user', 'dealer', 'admin'], default: 'user' },
    password: { type: String }, // optional if using OTP only; kept for dealers/admins
    createdAt: { type: Date, default: Date.now },

    qrCode: { type: String }, // stores image (data URL)
    qrEncryptedId: { type: String }, // stores encrypted ID
    lastDistributionMonth: { type: String, default: null }


});

module.exports = mongoose.model('User', userSchema);