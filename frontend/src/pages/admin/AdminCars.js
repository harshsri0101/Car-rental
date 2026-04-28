import React, { useEffect, useState } from "react";
import API from "../../services/api";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

const formatCurrency = (value) =>
  Number.isFinite(value) ? `Rs. ${value.toLocaleString("en-IN")}` : "Rs. --";

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) {
      return;
    }

    await API.delete(`/cars/${id}`);
    fetchCars();
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Fleet Inventory</p>
          <h1 style={styles.title}>Vehicle catalog</h1>
          <p style={styles.copy}>
            Review pricing, operational state, and baseline vehicle details.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading fleet...</div>
      ) : cars.length === 0 ? (
        <div style={styles.empty}>No cars found.</div>
      ) : (
        <div style={styles.grid}>
          {cars.map((car) => (
            <div key={car._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>{car.name}</h3>
                  <p style={styles.cardMeta}>
                    {car.brand || "Unknown brand"} {car.model ? `| ${car.model}` : ""}
                  </p>
                </div>
                <span style={car.available !== false ? styles.liveBadge : styles.offlineBadge}>
                  {car.available !== false ? "available" : "offline"}
                </span>
              </div>

              <div style={styles.detailBlock}>
                <p style={styles.detailItem}>Price: {formatCurrency(getCarPrice(car))}</p>
                <p style={styles.detailItem}>Seats: {car.seats || "N/A"}</p>
                <p style={styles.detailItem}>Fuel: {car.fuelType || "N/A"}</p>
                <p style={styles.detailItem}>Transmission: {car.transmission || "N/A"}</p>
              </div>

              <button onClick={() => deleteCar(car._id)} style={styles.deleteButton}>
                Delete Car
              </button>
            </div>
          ))}
        </div>
      )}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  card: {
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(88, 102, 117, 0.12)",
    boxShadow: "0 14px 32px rgba(83, 92, 102, 0.08)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    marginBottom: "18px",
  },
  cardTitle: {
    margin: "0 0 6px",
    fontSize: "20px",
  },
  cardMeta: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  liveBadge: {
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#dff6e7",
    color: "#17643c",
    border: "1px solid #9fd3b2",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  offlineBadge: {
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#fde2e1",
    color: "#a12d2d",
    border: "1px solid #f3b4b1",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  detailBlock: {
    display: "grid",
    gap: "10px",
    marginBottom: "18px",
  },
  detailItem: {
    margin: 0,
    color: "#314050",
  },
  deleteButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #f0c0bc",
    background: "#fff1ef",
    color: "#ad3830",
    fontWeight: "700",
    cursor: "pointer",
  },
  empty: {
    padding: "28px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.86)",
    border: "1px dashed #d3c4b3",
    color: "#6b7280",
  },
};
