const Car = require("../models/Car");

// ➕ ADD CAR
const addCar = async (req, res) => {
  try {
    const { name, price, image, fuel, seats, transmission } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    const car = await Car.create({
      name,
      price,
      image,
      fuel,
      seats,
      transmission
    });

    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 GET ALL CARS
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 GET SINGLE CAR (NEW)
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE CAR
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE CAR
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addCar,
  getCars,
  getCarById, 
  updateCar,
  deleteCar
};