import React, { useEffect, useState } from "react";
import API from "../../services/api";

const formatCurrency = (value) =>
  Number.isFinite(Number(value))
    ? `Rs. ${Number(value).toLocaleString("en-IN")}`
    : "Rs. --";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "N/A";

const statusStyles = {
  pending: {
    background: "#fff3cf",
    color: "#9a6700",
    border: "1px solid #f0d182",
  },
  confirmed: {
    background: "#dff6e7",
    color: "#17643c",
    border: "1px solid #9fd3b2",
  },
  cancelled: {
    background: "#fde2e1",
    color: "#a12d2d",
    border: "1px solid #f3b4b1",
  },
  booked: {
    background: "#e4eefc",
    color: "#1e4fa8",
    border: "1px solid #b4c9ee",
  },
};

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Reservations</p>
          <h1 style={styles.title}>All bookings</h1>
          <p style={styles.copy}>
            Track booking value, trip windows, and customer contact details in one
            review list.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div style={styles.empty}>No bookings found.</div>
      ) : (
        <div style={styles.list}>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>
                    {booking.carId?.name || booking.carId?.model || "Unknown car"}
                  </h3>
                  <p style={styles.cardMeta}>
                    Username: {booking.userId?.name || "N/A"} | Booking Name:{" "}
                    {booking.name || "N/A"}
                  </p>
                  <p style={styles.cardMeta}>
                    {booking.userId?.email || booking.email || "N/A"}
                  </p>
                </div>
                <span
                  style={{
                    ...styles.statusPill,
                    ...(statusStyles[booking.status] || statusStyles.pending),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div style={styles.grid}>
                <div>
                  <span style={styles.label}>Booking ID</span>
                  <div style={styles.value}>{booking._id}</div>
                </div>
                <div>
                  <span style={styles.label}>Phone</span>
                  <div style={styles.value}>{booking.phone || "N/A"}</div>
                </div>
                <div>
                  <span style={styles.label}>Email</span>
                  <div style={styles.value}>
                    {booking.userId?.email || booking.email || "N/A"}
                  </div>
                </div>
                <div>
                  <span style={styles.label}>Pickup</span>
                  <div style={styles.value}>{formatDate(booking.fromDate)}</div>
                </div>
                <div>
                  <span style={styles.label}>Return</span>
                  <div style={styles.value}>{formatDate(booking.toDate)}</div>
                </div>
                <div>
                  <span style={styles.label}>Total</span>
                  <div style={styles.value}>{formatCurrency(booking.totalPrice)}</div>
                </div>
              </div>
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
  list: {
    display: "grid",
    gap: "16px",
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
    flexWrap: "wrap",
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
  statusPill: {
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#8c94a0",
  },
  value: {
    color: "#182734",
    fontWeight: "600",
    lineHeight: 1.5,
  },
  empty: {
    padding: "28px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.86)",
    border: "1px dashed #d3c4b3",
    color: "#6b7280",
  },
};
