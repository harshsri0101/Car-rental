const Booking = require("../models/Booking");
const Car = require("../models/Car");

// ========================
// CREATE BOOKING
// ========================
const createBooking = async (req, res) => {
  try {
    const {
      carId,
      fromDate,
      toDate,
      name,
      email,
      phone
    } = req.body;

    if (!carId || !fromDate || !toDate || !name || !phone) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const totalPrice = days * car.price;

    const booking = await Booking.create({
      carId,
      fromDate: start,
      toDate: end,
      name,
      email,
      phone,
      totalPrice,
      status: "booked"
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// GET ALL BOOKINGS ✅ NEW
// ========================
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("carId");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// EXPORT BOTH ✅ FIXED
// ========================
module.exports = { createBooking, getBookings };