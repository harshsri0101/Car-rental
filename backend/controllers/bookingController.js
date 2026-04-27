const Booking = require("../models/Booking");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { carId, name, email, phone, fromDate, toDate } = req.body;

    // validation
    if (!carId || !fromDate || !toDate) {
      return res.status(400).json({ message: "carId, fromDate, toDate are required" });
    }

    // total days calculate karo
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    // car ki price lo
    const Car = require("../models/Car");
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const totalPrice = days * car.price;

    // booking banao
    const booking = await Booking.create({
      userId: req.user.id,  // ✅ token se user ID
      carId,
      name,
      email,
      phone,
      fromDate,
      toDate,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({ message: "Booking created successfully", booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL BOOKINGS (Admin)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")   // ✅ user ka naam email aayega
      .populate("carId", "name price")    // ✅ car ka naam price aayega
      .sort({ createdAt: -1 });           // ✅ latest pehle

    res.json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET MY BOOKINGS (Client)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("carId", "name price image")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE BOOKING STATUS (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Status updated", booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createBooking, getBookings, getMyBookings, updateBookingStatus };