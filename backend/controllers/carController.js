const Car = require("../models/Car");

// ADD CAR (Full Details)
const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      pricePerDay,
      fuelType,
      transmission,
      seats,
      image,
      location,
      description,
    } = req.body;

    const car = await Car.create({
      name,
      brand,
      model,
      year,
      pricePerDay,
      fuelType,
      transmission,
      seats,
      image,
      location,
      description,
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CARS
const getCars = async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
};

// DELETE CAR
const deleteCar = async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: "Car deleted" });
};

module.exports = { addCar, getCars, deleteCar };