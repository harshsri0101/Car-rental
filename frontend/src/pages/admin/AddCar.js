import React, { useState } from "react";
import API from "../../services/api";

export default function AddCar() {
  const [car, setCar] = useState({
    name: "",
    brand: "",
    model: "",
    pricePerDay: "",
    fuelType: "",
    transmission: "",
    seats: "",
    image: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/cars/add", {
        ...car,
        pricePerDay: Number(car.pricePerDay),
        seats: car.seats ? Number(car.seats) : undefined,
      });

      setStatus({ type: "success", message: "Car added successfully." });
      setCar({
        name: "",
        brand: "",
        model: "",
        pricePerDay: "",
        fuelType: "",
        transmission: "",
        seats: "",
        image: "",
      });

      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Error adding car.",
      });
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>Admin Tools</p>
        <h1 style={styles.title}>Add New Car</h1>
        <p style={styles.copy}>Create a new fleet listing with pricing, fuel, and vehicle details.</p>
      </div>

      <div style={styles.card}>
        {status && (
          <div
            style={{
              ...styles.status,
              ...(status.type === "success" ? styles.success : styles.error),
            }}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            value={car.name}
            placeholder="Car Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="brand"
            value={car.brand}
            placeholder="Brand"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="model"
            value={car.model}
            placeholder="Model"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="pricePerDay"
            type="number"
            value={car.pricePerDay}
            placeholder="Price Per Day"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="fuelType"
            value={car.fuelType}
            placeholder="Fuel Type"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="transmission"
            value={car.transmission}
            placeholder="Transmission"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="seats"
            type="number"
            value={car.seats}
            placeholder="Seats"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="image"
            value={car.image}
            placeholder="Image URL"
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.submitButton}>
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "linear-gradient(135deg, #f3ecdf, #f7f4ee)",
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    color: "#182734",
  },
  hero: {
    padding: "28px",
    borderRadius: "28px",
    marginBottom: "24px",
    background: "linear-gradient(140deg, #14202b, #27394b)",
    color: "#f8f4ed",
    boxShadow: "0 22px 42px rgba(20, 32, 43, 0.16)",
  },
  eyebrow: {
    margin: "0 0 6px",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#d4b182",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "36px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  copy: {
    margin: 0,
    maxWidth: "620px",
    color: "#c5d0db",
    lineHeight: 1.7,
  },
  card: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(88, 102, 117, 0.14)",
    boxShadow: "0 14px 32px rgba(83, 92, 102, 0.08)",
  },
  status: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "14px",
  },
  success: {
    background: "#e4f7ea",
    color: "#1d6d3f",
    border: "1px solid #95d6af",
  },
  error: {
    background: "#fde8ea",
    color: "#9a1820",
    border: "1px solid #f2b6b8",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(20, 32, 43, 0.12)",
    background: "#fbfbfb",
    fontSize: "15px",
    color: "#1f2937",
    outline: "none",
  },
  submitButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "none",
    background: "#14202b",
    color: "#f8f4ed",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};
