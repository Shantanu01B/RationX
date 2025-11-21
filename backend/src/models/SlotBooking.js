const mongoose = require('mongoose');

const slotBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // Example: "10:00-11:00"
    month: { type: String, required: true } // Example: "2025-11"
}, { timestamps: true });

slotBookingSchema.index({ userId: 1, month: 1 }, { unique: true }); // Prevent double booking per month

module.exports = mongoose.model('SlotBooking', slotBookingSchema);