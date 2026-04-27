require("dotenv").config(); // ✅ sabse upar

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ db.js se connect karo

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("API running... 🚗");
});

// DB Connect + Server Start
connectDB().then(() => {                          // ✅ pehle DB connect
  app.listen(process.env.PORT || 5002, () => {   // ✅ .env se port lo
    console.log(`Server running on port ${process.env.PORT || 5002} ✅`);
  });
});