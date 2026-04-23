import React, { useState } from "react";
import API from "../../services/api";

export default function AddCar() {
  const [car, setCar] = useState({
    make: "",
    model: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/cars/add", car);
      alert("Car added successfully");
    } catch (err) {
      alert("Error adding car");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Car</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="make" placeholder="Make" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} required />
        <input name="price" placeholder="Price" onChange={handleChange} required />
        <input name="image" placeholder="Image URL" onChange={handleChange} required />

        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "300px",
    margin: "auto",
  },
};