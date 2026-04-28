const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: String,
    year: Number,
    pricePerDay: { type: Number, required: true }, // ✅ important
    fuelType: String,
    transmission: String,
    seats: Number,
    image: String,
    available: { type: Boolean, default: true },
    location: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);