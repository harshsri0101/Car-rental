const Booking = require("../models/Booking");

// CREATE BOOKING
const createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};

// GET BOOKINGS
const getBookings = async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
};

module.exports = { createBooking, getBookings };