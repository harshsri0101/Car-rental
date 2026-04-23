import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Booking from "./Booking";

export default function Home() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  // 🚗 fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await API.get("/cars");
        setCars(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCars();
  }, []);

  return (
    <div style={styles.container}>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1 style={styles.title}>🚗 Car Rental System</h1>
        <p style={styles.subtitle}>
          Rent premium cars instantly with affordable prices & smooth booking experience
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/cars")}
        >
          Explore Cars
        </button>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <div style={styles.card}>
          <h3>🚘 Wide Range</h3>
          <p>Choose from luxury, SUV, sports & economy cars</p>
        </div>

        <div style={styles.card}>
          <h3>⚡ Fast Booking</h3>
          <p>Book your car in just few clicks</p>
        </div>

        <div style={styles.card}>
          <h3>🔒 Secure</h3>
          <p>Safe & verified rental system</p>
        </div>
      </div>

      {/* 🚗 CAR LISTING SECTION (ADDED) */}
      <h2 style={{ marginTop: "60px" }}>Available Cars 🚗</h2>

      <div style={styles.carGrid}>
        {cars.map((car) => (
          <div key={car._id} style={styles.carCard}>

            <img
              src={car.image}
              alt={car.name}
              style={styles.carImg}
            />

            <h3>{car.name}</h3>
            <p>₹{car.price} / day</p>

            <button
              style={styles.bookBtn}
              onClick={() => setSelectedCar(car)}
            >
              Book Now
            </button>

          </div>
        ))}
      </div>

      {/* 🚨 BOOKING POPUP */}
      {selectedCar && (
        <Booking
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {/* CTA SECTION */}
      <div style={styles.cta}>
        <h2>Ready to ride your dream car?</h2>
        <button
          style={styles.ctaButton}
          onClick={() => navigate("/cars")}
        >
          Book Now 🚗
        </button>
      </div>

    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    background: "linear-gradient(135deg, #000, #1f2a40)",
    minHeight: "100vh",
    color: "white",
  },

  hero: {
    marginBottom: "50px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#ccc",
    maxWidth: "600px",
    margin: "0 auto 20px",
  },

  button: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#fff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "40px",
  },

  card: {
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },

  /* 🚗 CAR SECTION */
  carGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  },

  carCard: {
    width: "220px",
    padding: "15px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
  },

  carImg: {
    width: "100%",
    borderRadius: "10px",
  },

  bookBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    background: "#00c6ff",
    color: "white",
    cursor: "pointer",
  },

  cta: {
    marginTop: "60px",
  },

  ctaButton: {
    marginTop: "15px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#00c6ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};