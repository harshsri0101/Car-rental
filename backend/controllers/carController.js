const Car = require("../models/car");
const { getNormalizedPrice, parsePriceValue } = require("../utils/price");

const buildCarPayload = (body, { requirePrice = false } = {}) => {
  const payload = { ...body };

  const normalizedPrice = parsePriceValue(body.pricePerDay ?? body.price);
  if (requirePrice && (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0)) {
    return {
      error: "Car price is invalid",
    };
  }

  if (normalizedPrice !== null) {
    payload.pricePerDay = normalizedPrice;
  }

  if (payload.year !== undefined && payload.year !== "") {
    payload.year = Number(payload.year);
  }

  if (payload.seats !== undefined && payload.seats !== "") {
    payload.seats = Number(payload.seats);
  }

  return { payload };
};

const addCar = async (req, res) => {
  try {
    const { payload, error } = buildCarPayload(req.body, { requirePrice: true });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const car = new Car(payload);
    await car.save();

    res.status(201).json({
      message: "Car added successfully",
      car,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    const normalizedCars = cars.map((car) => {
      const normalizedPrice = getNormalizedPrice(car);
      const carObject = car.toObject();

      if (Number.isFinite(normalizedPrice)) {
        carObject.pricePerDay = normalizedPrice;
      }

      return carObject;
    });

    res.json(normalizedCars);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateCar = async (req, res) => {
  try {
    const { payload, error } = buildCarPayload(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const car = await Car.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addCar,
  getCars,
  updateCar,
  deleteCar,
};
