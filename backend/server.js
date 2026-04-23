const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROUTES IMPORT
// =====================
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


// =====================
// ROUTES MOUNT
// =====================

// AUTH ROUTES
app.use("/api", authRoutes); 
// → /api/register
// → /api/login

// CAR ROUTES
app.use("/api/cars", carRoutes); 
// → /api/cars

// USER ROUTES (admin/protected)
app.use("/api/users", userRoutes);
// → /api/users


app.use("/api/bookings", bookingRoutes);
// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =====================
// DATABASE CONNECTION
// =====================
mongoose.connect("mongodb://127.0.0.1:27017/car_rental")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// =====================
// START SERVER
// =====================
const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});