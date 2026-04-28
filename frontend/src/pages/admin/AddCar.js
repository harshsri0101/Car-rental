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
      alert("Car added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding car");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Car</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Car Name" onChange={handleChange} required />
        <input name="brand" placeholder="Brand" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} />
        <input
          name="pricePerDay"
          placeholder="Price Per Day"
          onChange={handleChange}
          required
        />
        <input name="fuelType" placeholder="Fuel Type" onChange={handleChange} />
        <input
          name="transmission"
          placeholder="Transmission"
          onChange={handleChange}
        />
        <input name="seats" placeholder="Seats" onChange={handleChange} />
        <input name="image" placeholder="Image URL" onChange={handleChange} />

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
