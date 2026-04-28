const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/auth");
const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, isAdmin, getBookings);
router.get("/my", verifyToken, getMyBookings);
router.put("/:id", verifyToken, isAdmin, updateBookingStatus);

module.exports = router;
