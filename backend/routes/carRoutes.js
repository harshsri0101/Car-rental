const express = require("express");
const router = express.Router();

const Car = require("../models/Car");
const { verifyToken, isAdmin } = require("../middleware/auth");

// ✅ GET ALL CARS
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD CAR (ADMIN)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { make, model, price, image } = req.body;

    if (!make || !model || !price || !image) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newCar = new Car(req.body);
    await newCar.save();

    res.json({ message: "Car added successfully", car: newCar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE CAR (ADMIN)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;