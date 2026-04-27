const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

// create booking
router.post("/", verifyToken, createBooking);

// admin - all bookings
router.get("/", verifyToken, getBookings);

// user - own bookings
router.get("/my", verifyToken, getMyBookings);

// update status
router.put("/:id", verifyToken, updateBookingStatus);

module.exports = router; // ✅ MUST be this