const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    venue: { type: String, required: true },
    date: { type: Date },
    totalSeats: { type: String, required: true },
    availableSeats: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, enum: ["planned", "completed", "cancel"], default: "planned" }
}, { timestamps: true });

module.exports = mongoose.model("Events", EventSchema);