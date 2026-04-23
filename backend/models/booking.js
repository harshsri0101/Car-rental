const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    name: String,
    email: String,
    phone: String,

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },

    fromDate: Date,
    toDate: Date,

    totalPrice: Number,

    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);