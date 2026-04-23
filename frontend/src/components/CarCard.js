import React from "react";

export default function CarCard({ car }) {

  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    alert(`Booked: ${car.make} ${car.model}`);
  };

  return (
    <div style={styles.card}>
      
      {/* IMAGE */}
      <img
        src={car.image}
        alt={car.model}
        style={styles.image}
      />

      {/* INFO */}
      <div style={styles.info}>
        <h3>{car.make} {car.model}</h3>
        <p>Year: {car.year}</p>
        <p>Color: {car.color}</p>
        <h4>₹ {car.price} / day</h4>
      </div>

      {/* BUTTON */}
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
    background: "#fff"
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },

  info: {
    padding: "10px"
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};