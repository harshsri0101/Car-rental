const parsePriceValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    if (!normalized) {
      return null;
    }

    const numericValue = Number(normalized);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getNormalizedPrice = (car) => {
  if (!car) {
    return null;
  }

  const dynamicPrice =
    typeof car.get === "function" ? car.get("price") : car.price;
  const dynamicPricePerDay =
    typeof car.get === "function" ? car.get("pricePerDay") : car.pricePerDay;

  const candidates = [dynamicPricePerDay, dynamicPrice];

  for (const value of candidates) {
    const parsedValue = parsePriceValue(value);
    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return parsedValue;
    }
  }

  return null;
};

module.exports = {
  parsePriceValue,
  getNormalizedPrice,
};
