import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { API_ORIGIN } from "../services/api";
import Booking from "./Booking";
import Footer from "../components/Footer";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

const buildImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/420x260?text=No+Image";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
};

export default function Home() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await API.get("/cars");
        setCars(res.data.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCars();
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>Car Rental</p>
          <h1 style={styles.title}>Find the right car for your next trip.</h1>
          <p style={styles.subtitle}>
            Browse clean, ready-to-book cars with simple pricing and a quick
            booking flow.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={() => navigate("/cars")}>
              Explore Cars
            </button>
            <button style={styles.secondaryButton} onClick={() => navigate("/cars")}>
              Quick Booking
            </button>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <div style={styles.heroStat}>
            <strong style={styles.heroStatValue}>Easy booking</strong>
            <span style={styles.heroStatLabel}>Pick dates and confirm in minutes</span>
          </div>
          <div style={styles.heroStat}>
            <strong style={styles.heroStatValue}>Clear pricing</strong>
            <span style={styles.heroStatLabel}>See the daily rate before you book</span>
          </div>
          <div style={styles.heroStat}>
            <strong style={styles.heroStatValue}>Multiple options</strong>
            <span style={styles.heroStatLabel}>SUVs, sedans, and city cars</span>
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h3 style={styles.featureTitle}>Wide Range</h3>
          <p style={styles.featureText}>
            Choose from budget-friendly, family, and premium cars.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.featureTitle}>Simple Process</h3>
          <p style={styles.featureText}>
            Check details, select dates, and place a booking quickly.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.featureTitle}>Useful Details</h3>
          <p style={styles.featureText}>
            Review fuel, transmission, seating, and daily rate before booking.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>Featured Cars</p>
            <h2 style={styles.sectionTitle}>Available right now</h2>
          </div>
          <button style={styles.linkButton} onClick={() => navigate("/cars")}>
            View all cars
          </button>
        </div>

        <div style={styles.carGrid}>
          {cars.length === 0 ? (
            <div style={styles.emptyState}>No cars available at the moment.</div>
          ) : (
            cars.map((car) => (
              <div key={car._id} style={styles.carCard}>
                <img
                  src={buildImageUrl(car.image)}
                  alt={car.name}
                  style={styles.carImage}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/420x260?text=No+Image";
                  }}
                />

                <div style={styles.carBody}>
                  <div style={styles.carTop}>
                    <div>
                      <h3 style={styles.carName}>{car.name}</h3>
                      <p style={styles.carMeta}>{car.brand || "N/A"}</p>
                    </div>
                    <span style={styles.priceTag}>
                      {Number.isFinite(getCarPrice(car))
                        ? `Rs. ${getCarPrice(car)} / day`
                        : "Price unavailable"}
                    </span>
                  </div>

                  <div style={styles.specRow}>
                    <span>{car.fuelType || "Fuel N/A"}</span>
                    <span>{car.transmission || "Transmission N/A"}</span>
                    <span>{car.seats ? `${car.seats} seats` : "Seats N/A"}</span>
                  </div>

                  <button style={styles.cardButton} onClick={() => setSelectedCar(car)}>
                    Book This Car
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Need a car for your next ride?</h2>
        <p style={styles.ctaText}>
          Browse the full list and choose the one that fits your trip.
        </p>
        <button style={styles.primaryButton} onClick={() => navigate("/cars")}>
          Browse Cars
        </button>
      </section>

      <Footer />

      {selectedCar && (
        <Booking car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "24px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    marginBottom: "28px",
  },
  heroText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#93c5fd",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 14px",
    fontSize: "48px",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "0 0 24px",
    maxWidth: "580px",
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: "16px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  heroPanel: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "24px",
    display: "grid",
    gap: "16px",
  },
  heroStat: {
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  heroStatValue: {
    display: "block",
    fontSize: "18px",
    marginBottom: "6px",
  },
  heroStatLabel: {
    color: "#cbd5e1",
    fontSize: "14px",
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },
  featureCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  featureTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
  },
  featureText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
  section: {
    marginBottom: "28px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  sectionEyebrow: {
    margin: "0 0 6px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    fontWeight: "700",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "30px",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    padding: 0,
  },
  carGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  carCard: {
    overflow: "hidden",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
  },
  carImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
  },
  carBody: {
    padding: "18px",
  },
  carTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  carName: {
    margin: "0 0 6px",
    fontSize: "20px",
  },
  carMeta: {
    margin: 0,
    color: "#64748b",
  },
  priceTag: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
    whiteSpace: "nowrap",
  },
  specRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    color: "#475569",
    fontSize: "14px",
    marginBottom: "16px",
  },
  cardButton: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  emptyState: {
    padding: "24px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#64748b",
  },
  cta: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "30px",
    textAlign: "center",
  },
  ctaTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
  },
  ctaText: {
    margin: "0 0 18px",
    color: "#475569",
  },
};
