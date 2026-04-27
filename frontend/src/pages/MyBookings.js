import React, { useEffect, useState } from "react";
import API from "../services/api";  // ✅ ye import karo

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // ✅ fetch ki jagah API use karo — token automatically jayega
    API.get("/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings 📅</h2>

      {bookings.map(b => (
        <div key={b._id} style={{ border: "1px solid gray", margin: "10px" }}>
          <h3>Car: {b.carId?.name}</h3>
          <p>User: {b.userId?.name}</p>
          <p>Email: {b.userId?.email}</p>
          <p>From: {new Date(b.fromDate).toDateString()}</p>
          <p>To: {new Date(b.toDate).toDateString()}</p>
          <p>Total: ₹{b.totalPrice}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;