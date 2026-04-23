import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>🛠️ Admin Dashboard</h1>

      <div style={styles.cardContainer}>
        <div style={styles.card} onClick={() => navigate("/admin/cars")}>
          🚗 Manage Cars
        </div>

        <div style={styles.card} onClick={() => navigate("/admin/add-car")}>
          ➕ Add New Car
        </div>

        <div style={styles.card} onClick={() => navigate("/admin/bookings")}>
          📅 View Bookings
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    padding: "30px",
    background: "#333",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    width: "200px",
    fontSize: "18px",
  },
};