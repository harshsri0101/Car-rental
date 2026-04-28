require("dotenv").config({ path: "backend/.env" });

const mongoose = require("mongoose");
const Car = require("../models/car");
const { getNormalizedPrice } = require("../utils/price");

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const cars = await Car.find();
  let updated = 0;
  let invalid = 0;

  for (const car of cars) {
    const normalizedPrice = getNormalizedPrice(car);

    if (!Number.isFinite(normalizedPrice)) {
      invalid += 1;
      console.log(`Invalid price for car ${car._id} (${car.name || "Unnamed"})`);
      continue;
    }

    if (car.pricePerDay !== normalizedPrice) {
      await Car.updateOne(
        { _id: car._id },
        { $set: { pricePerDay: normalizedPrice } }
      );
      updated += 1;
    }
  }

  console.log(`Cars updated: ${updated}`);
  console.log(`Cars still invalid: ${invalid}`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // Ignore disconnect errors after a failed startup path.
  }
  process.exit(1);
});
