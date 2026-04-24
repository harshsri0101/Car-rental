const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

mongoose.connect("mongodb://127.0.0.1:27017/car_rental")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5002, () => {
  console.log("Server running on port 5002");
});