const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    dealerId: { type: String, required: true, unique: true },
    address: { type: String },
    mobile: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true }, // dealer logs in by credentials
    stock: {
        riceKg: { type: Number, default: 0 },
        wheatKg: { type: Number, default: 0 },
        sugarKg: { type: Number, default: 0 },
        oilL: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dealer', dealerSchema);