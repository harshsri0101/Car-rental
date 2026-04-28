const Booking = require("../models/booking");
const Car = require("../models/car");
const { getNormalizedPrice } = require("../utils/price");

const createBooking = async (req, res) => {
  try {
    const { carId, name, email, phone, fromDate, toDate } = req.body;

    if (!carId || !fromDate || !toDate) {
      return res.status(400).json({
        message: "carId, fromDate, toDate are required",
      });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const overlappingBooking = await Booking.findOne({
      carId,
      status: { $ne: "cancelled" },
      fromDate: { $lt: to },
      toDate: { $gt: from },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: "Car is not available on that day",
      });
    }

    const dailyPrice = getNormalizedPrice(car);

    if (!Number.isFinite(dailyPrice) || dailyPrice <= 0) {
      return res.status(400).json({
        message: "Car price is invalid",
      });
    }

    if (car.pricePerDay !== dailyPrice) {
      await Car.updateOne(
        { _id: car._id },
        { $set: { pricePerDay: dailyPrice } }
      );
    }

    const totalPrice = days * dailyPrice;

    if (!Number.isFinite(totalPrice)) {
      return res.status(400).json({
        message: "Total price calculation failed",
      });
    }

    const booking = await Booking.create({
      userId: req.user?.id,
      carId,
      name,
      email,
      phone,
      fromDate: from,
      toDate: to,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.log("Booking Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("carId", "name pricePerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("carId", "name pricePerDay image")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
};
