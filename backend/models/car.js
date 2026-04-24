const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  year: {
    type: Number,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  fuelType: {
    type: String, // Petrol / Diesel / Electric
  },
  transmission: {
    type: String, // Manual / Automatic
  },
  seats: {
    type: Number,
  },
  image: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);