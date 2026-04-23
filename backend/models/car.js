const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  fuel: String,
  seats: Number,
  Year: Number,
  color: String,
  transmission: String
});

module.exports = mongoose.model("Car", carSchema);