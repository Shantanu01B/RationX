const mongoose = require("mongoose");

const dealerStockSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true },
    month: { type: String, required: true }, // Example: "2025-11"
    stock: {
        riceKg: { type: Number, default: 0 },
        wheatKg: { type: Number, default: 0 },
        sugarKg: { type: Number, default: 0 },
        oilL: { type: Number, default: 0 }
    }
});

dealerStockSchema.index({ dealerId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("DealerStock", dealerStockSchema);