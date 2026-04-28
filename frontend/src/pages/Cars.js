import React, { useEffect, useState } from "react";
import API, { API_ORIGIN } from "../services/api";
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

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    API.get("/cars")
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching cars:", err);
        setError("Failed to load cars. Please make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowBookingForm(false);
    setBookingConfirmed(false);
    setBookingMessage("");
  };

  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first to book a car");
      return;
    }

    if (!selectedCar) {
      return;
    }

    if (!Number.isFinite(getCarPrice(selectedCar)) || getCarPrice(selectedCar) <= 0) {
      alert("This car does not have a valid daily price yet.");
      return;
    }

    setShowBookingForm(true);
    setBookingConfirmed(false);
    setBookingMessage("");
    setFormData({ name: "", email: "", phone: "", fromDate: "", toDate: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalDays =
    formData.fromDate &&
    formData.toDate &&
    new Date(formData.toDate) > new Date(formData.fromDate)
      ? Math.ceil(
          (new Date(formData.toDate) - new Date(formData.fromDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const handleSubmit = async () => {
    const { name, email, phone, fromDate, toDate } = formData;

    if (!name || !phone || !fromDate || !toDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (new Date(toDate) <= new Date(fromDate)) {
      alert("Return date must be after pickup date.");
      return;
    }

    if (
      !selectedCar ||
      !Number.isFinite(getCarPrice(selectedCar)) ||
      getCarPrice(selectedCar) <= 0
    ) {
      alert("This car does not have a valid daily price yet.");
      return;
    }

    try {
      await API.post("/bookings", {
        carId: selectedCar._id,
        name,
        email,
        phone,
        fromDate,
        toDate,
      });
      setBookingConfirmed(true);
      setBookingMessage("");
      setShowBookingForm(false);
    } catch (err) {
      console.log("Booking error:", err);
      setBookingConfirmed(false);
      setShowBookingForm(false);
      setBookingMessage(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    }
  };

  const handleClose = () => {
    setSelectedCar(null);
    setShowBookingForm(false);
    setBookingConfirmed(false);
    setBookingMessage("");
  };

  const carSpecs = (car) =>
    [
      car.year ? `Year: ${car.year}` : null,
      car.fuelType ? `Fuel: ${car.fuelType}` : null,
      car.seats ? `Seats: ${car.seats}` : null,
      car.transmission ? `Transmission: ${car.transmission}` : null,
    ].filter(Boolean);

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Available Cars</p>
          <h1 style={styles.title}>Choose a car that fits your trip.</h1>
          <p style={styles.subtitle}>
            Compare daily rates, seating, fuel type, and availability before you
            book.
          </p>
        </div>
      </section>

      {loading && <p style={styles.message}>Loading cars...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {cars.length === 0 ? (
            <div style={styles.emptyState}>No cars available at the moment.</div>
          ) : (
            cars.map((car) => (
              <div key={car._id} style={styles.card}>
                <img
                  src={buildImageUrl(car.image)}
                  alt={car.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/420x260?text=No+Image";
                  }}
                />

                <div style={styles.info}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.carName}>{car.name}</h3>
                      {car.brand ? <p style={styles.carMeta}>{car.brand}</p> : null}
                    </div>
                    <span style={styles.priceTag}>
                      {Number.isFinite(getCarPrice(car))
                        ? `Rs. ${getCarPrice(car)} / day`
                        : "Price unavailable"}
                    </span>
                  </div>

                  {carSpecs(car).length > 0 ? (
                    <div style={styles.specGrid}>
                      {carSpecs(car).map((spec) => (
                        <span key={spec}>{spec}</span>
                      ))}
                    </div>
                  ) : null}

                  {!Number.isFinite(getCarPrice(car)) ? (
                    <p style={styles.unavailableText}>Price unavailable</p>
                  ) : null}

                  <button
                    style={car.available ? styles.button : styles.buttonDisabled}
                    onClick={() => car.available && handleViewDetails(car)}
                    disabled={!car.available}
                  >
                    {car.available ? "View Details" : "Not Available"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCar && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={handleClose}>
              Close
            </button>
            {bookingConfirmed ? (
              <>
                <div style={styles.confirmationBox}>
                  <h2 style={styles.modalTitle}>Booking Confirmed</h2>
                  <p style={styles.modalSubtitle}>
                    Your booking is confirmed.
                  </p>
                  <p style={styles.confirmationText}>
                    The owner will contact you shortly.
                  </p>
                  <button style={styles.button} onClick={handleClose}>
                    Done
                  </button>
                </div>
              </>
            ) : bookingMessage ? (
              <>
                <div style={styles.confirmationBox}>
                  <h2 style={styles.modalTitle}>Car Not Available</h2>
                  <p style={styles.modalSubtitle}>{bookingMessage}</p>
                  <p style={styles.confirmationText}>
                    Please choose different dates or select another car.
                  </p>
                  <button
                    style={styles.button}
                    onClick={() => {
                      setBookingMessage("");
                      setShowBookingForm(true);
                    }}
                  >
                    Try Other Dates
                  </button>
                </div>
              </>
            ) : showBookingForm ? (
              <>
                <h2 style={styles.modalTitle}>Book {selectedCar.name}</h2>
                <p style={styles.modalSubtitle}>
                  {Number.isFinite(getCarPrice(selectedCar))
                    ? `Rs. ${getCarPrice(selectedCar)} / day`
                    : "Price unavailable"}
                </p>

                <label style={styles.label}>Full Name *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <label style={styles.label}>Email Address</label>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <label style={styles.label}>Mobile Number *</label>
                <input
                  style={styles.input}
                  type="tel"
                  name="phone"
                  placeholder="Enter your mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div style={styles.dateGrid}>
                  <div>
                    <label style={styles.label}>Pickup Date *</label>
                    <input
                      style={styles.input}
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Return Date *</label>
                    <input
                      style={styles.input}
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      min={
                        formData.fromDate || new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>

                {totalDays > 0 && Number.isFinite(getCarPrice(selectedCar)) ? (
                  <div style={styles.pricePreview}>
                    <p style={styles.previewLine}>Total Days: {totalDays}</p>
                    <p style={styles.previewLine}>
                      Total Price: Rs. {totalDays * getCarPrice(selectedCar)}
                    </p>
                  </div>
                ) : null}

                <div style={styles.modalActions}>
                  <button style={styles.secondaryButton} onClick={() => setShowBookingForm(false)}>
                    Back to Details
                  </button>
                  <button style={styles.button} onClick={handleSubmit}>
                    Confirm Booking
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={buildImageUrl(selectedCar.image)}
                  alt={selectedCar.name}
                  style={styles.modalImage}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/420x260?text=No+Image";
                  }}
                />
                <h2 style={styles.modalTitle}>{selectedCar.name}</h2>
                {selectedCar.brand ? (
                  <p style={styles.modalSubtitle}>{selectedCar.brand}</p>
                ) : null}

                <div style={styles.detailGrid}>
                  {carSpecs(selectedCar).map((spec) => (
                    <div key={spec} style={styles.detailCard}>
                      {spec}
                    </div>
                  ))}
                  {Number.isFinite(getCarPrice(selectedCar)) ? (
                    <div style={styles.detailCard}>
                      Price: Rs. {getCarPrice(selectedCar)} / day
                    </div>
                  ) : null}
                  <div style={styles.detailCard}>
                    Status: {selectedCar.available ? "Available" : "Not Available"}
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button
                    style={selectedCar.available ? styles.button : styles.buttonDisabled}
                    onClick={handleBook}
                    disabled={!selectedCar.available}
                  >
                    {selectedCar.available ? "Continue to Book" : "Not Available"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f8fafc",
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
  },
  header: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "40px",
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    maxWidth: "700px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
  },
  info: {
    padding: "18px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  carName: {
    margin: "0 0 6px",
    fontSize: "22px",
    color: "#0f172a",
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
  specGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "16px",
    color: "#475569",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px 16px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  buttonDisabled: {
    width: "100%",
    padding: "12px 16px",
    background: "#e2e8f0",
    color: "#64748b",
    border: "none",
    cursor: "not-allowed",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
  },
  message: {
    fontSize: "16px",
    color: "#475569",
  },
  error: {
    fontSize: "16px",
    color: "#b91c1c",
    fontWeight: "700",
  },
  unavailableText: {
    color: "#b91c1c",
    fontSize: "14px",
    marginTop: 0,
    marginBottom: "14px",
  },
  emptyState: {
    padding: "24px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#64748b",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
    boxSizing: "border-box",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    width: "100%",
    maxWidth: "520px",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
  },
  modalImage: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "18px",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    color: "#475569",
    fontWeight: "700",
  },
  modalTitle: {
    marginBottom: "6px",
    fontSize: "28px",
    color: "#0f172a",
    marginTop: 0,
  },
  modalSubtitle: {
    color: "#64748b",
    marginBottom: "16px",
    lineHeight: 1.6,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  detailCard: {
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
  },
  confirmationBox: {
    textAlign: "center",
    padding: "24px 8px 8px",
  },
  confirmationText: {
    margin: "0 0 20px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  pricePreview: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "14px",
    color: "#1d4ed8",
  },
  previewLine: {
    margin: "0 0 6px",
    fontWeight: "700",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    flex: 1,
    minWidth: "160px",
    padding: "12px 16px",
    background: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    borderRadius: "10px",
    fontWeight: "700",
  },
};
