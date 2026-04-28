import React from "react";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

export default function CarCard({ car }) {
  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    alert(`Booked: ${car.name}`);
  };

  return (
    <div style={styles.card}>
      <img src={car.image} alt={car.name} style={styles.image} />

      <div style={styles.info}>
        <h3>{car.name}</h3>
        <p>Brand: {car.brand}</p>
        <p>Year: {car.year}</p>
        <p>Fuel: {car.fuelType}</p>
        <h4>Rs. {Number.isFinite(getCarPrice(car)) ? getCarPrice(car) : "--"} / day</h4>
      </div>

      <button style={styles.button} onClick={handleBook}>
        Book Now
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  info: {
    padding: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
