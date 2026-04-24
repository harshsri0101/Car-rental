const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { createBooking, getBookings } = require("../controllers/bookingController");

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);

module.exports = router;