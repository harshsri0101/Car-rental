import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await API.get("/booking");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={styles.container}>
      <h2>📅 All Bookings</h2>

      {bookings.map((b) => (
        <div key={b._id} style={styles.card}>
          <p>User: {b.userId?.name}</p>
          <p>Car: {b.carId?.model}</p>
          <p>Date: {b.date}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  card: {
    border: "1px solid #ccc",
    margin: "10px",
    padding: "10px",
  },
};