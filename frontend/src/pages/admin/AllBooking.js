import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings"); // ✅ fix
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to fetch bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading bookings...</p>;

  return (
    <div style={styles.container}>
      <h2>📅 All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            <p><strong>Booking ID:</strong> {b._id}</p>
            <p><strong>User:</strong> {b.userId?.name || b.name}</p>
            <p><strong>Email:</strong> {b.userId?.email || b.email}</p>
            <p><strong>Phone:</strong> {b.phone}</p>
            <p><strong>Car:</strong> {b.carId?.name || b.carId?.model}</p>
            <p><strong>From:</strong> {new Date(b.fromDate).toDateString()}</p>
            <p><strong>To:</strong> {new Date(b.toDate).toDateString()}</p>
            <p><strong>Total Price:</strong> ₹{b.totalPrice}</p>
            <p><strong>Status:</strong> {b.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  card: {
    border: "1px solid #ccc",
    margin: "10px",
    padding: "15px",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
};