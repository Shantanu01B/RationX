const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
        riceKg: { type: Number, default: 0 },
        wheatKg: { type: Number, default: 0 },
        sugarKg: { type: Number, default: 0 },
        oilL: { type: Number, default: 0 }
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);