
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// =====================
// CORS CONFIG (PRODUCTION READY)
// =====================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // add in production (Netlify/Vercel URL)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// ROUTES
// =====================
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// =====================
// HEALTH CHECK ROUTE
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚗 Car Rental API is running successfully",
    status: "OK",
  });
});

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

// =====================
// START SERVER ONLY AFTER DB CONNECT
// =====================
const PORT = process.env.PORT || 5002;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  });