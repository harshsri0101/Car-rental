import React, { useState } from "react";
import API from "../services/api";
const Booking = ({ car, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fromDate: "",
    toDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await API.post("/booking", {
        carId: car._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        fromDate: form.fromDate,
        toDate: form.toDate
      });

      alert("Booking Successful 🚗");
      onClose();

    } catch (err) {
      console.log(err);
      alert("Booking Failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h2>Book {car.name}</h2>

        <form onSubmit={handleBooking}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="fromDate"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="toDate"
            onChange={handleChange}
            required
          />

          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const box = {
  background: "white",
  padding: "20px",
  borderRadius: "10px"
};

export default Booking;