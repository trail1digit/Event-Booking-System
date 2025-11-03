// src/models/BookedEvent.js
const mongoose = require("mongoose");

const BookedEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Events", required: true },
  seatsBooked: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed", "cancelled"],
    default: "pending"
  },
  bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("BookedEvent", BookedEventSchema);
