import React, { useEffect, useState } from "react";
import API, { API_ORIGIN } from "../services/api";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

const buildImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/300x180?text=No+Image";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fromDate: "",
    toDate: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  const handleBook = (car) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first to book a car");
      return;
    }

    if (!Number.isFinite(getCarPrice(car)) || getCarPrice(car) <= 0) {
      alert("This car does not have a valid daily price yet.");
      return;
    }

    setSelectedCar(car);
    setBookingSuccess(false);
    setFormData({ name: "", email: "", phone: "", fromDate: "", toDate: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    if (!selectedCar || !Number.isFinite(getCarPrice(selectedCar)) || getCarPrice(selectedCar) <= 0) {
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
      setBookingSuccess(true);
    } catch (err) {
      console.log("Booking error:", err);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedCar(null);
    setBookingSuccess(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Available Cars</h2>

      {loading && <p style={styles.message}>Loading cars...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {cars.length === 0 ? (
            <p style={styles.message}>No cars available at the moment.</p>
          ) : (
            cars.map((car) => (
              <div key={car._id} style={styles.card}>
                <img
                  src={buildImageUrl(car.image)}
                  alt={car.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x180?text=No+Image";
                  }}
                />
                <div style={styles.info}>
                  {Number.isFinite(getCarPrice(car)) ? null : (
                    <p style={{ color: "red" }}>Price unavailable</p>
                  )}
                  <h3>{car.name}</h3>
                  <p>Brand: {car.brand}</p>
                  <p>Year: {car.year}</p>
                  <p>Fuel: {car.fuelType}</p>
                  <p>Seats: {car.seats}</p>
                  <p>Transmission: {car.transmission}</p>
                  <h4>Rs. {Number.isFinite(getCarPrice(car)) ? getCarPrice(car) : "--"} / day</h4>
                </div>
                <button
                  style={car.available ? styles.button : styles.buttonDisabled}
                  onClick={() => car.available && handleBook(car)}
                  disabled={!car.available}
                >
                  {car.available ? "Book Now" : "Not Available"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCar && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={handleClose}>
              X
            </button>

            {bookingSuccess ? (
              <div style={styles.successBox}>
                <h2>Booking Confirmed</h2>
                <p>
                  Your booking for <strong>{selectedCar.name}</strong> is placed
                  successfully.
                </p>
                <p>
                  We will contact you on <strong>{formData.phone}</strong>.
                </p>
                <button style={styles.button} onClick={handleClose}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 style={styles.modalTitle}>Book: {selectedCar.name}</h2>
                <p style={styles.modalSubtitle}>
                  Rs. {Number.isFinite(getCarPrice(selectedCar)) ? getCarPrice(selectedCar) : "--"} / day
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

                <label style={styles.label}>Pickup Date *</label>
                <input
                  style={styles.input}
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />

                <label style={styles.label}>Return Date *</label>
                <input
                  style={styles.input}
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || new Date().toISOString().split("T")[0]}
                />

                {formData.fromDate &&
                  formData.toDate &&
                  new Date(formData.toDate) > new Date(formData.fromDate) &&
                  Number.isFinite(getCarPrice(selectedCar)) && (
                    <div style={styles.pricePreview}>
                      Total Days:{" "}
                      {Math.ceil(
                        (new Date(formData.toDate) - new Date(formData.fromDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                      <br />
                      Total Price: Rs.{" "}
                      {Math.ceil(
                        (new Date(formData.toDate) - new Date(formData.fromDate)) /
                          (1000 * 60 * 60 * 24)
                      ) * getCarPrice(selectedCar)}
                    </div>
                  )}

                <button style={styles.button} onClick={handleSubmit}>
                  Confirm Booking
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { marginBottom: "20px", fontSize: "24px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  image: { width: "100%", height: "180px", objectFit: "cover" },
  info: { padding: "10px" },
  button: {
    width: "100%",
    padding: "10px",
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  buttonDisabled: {
    width: "100%",
    padding: "10px",
    background: "#ccc",
    color: "#666",
    border: "none",
    cursor: "not-allowed",
    fontSize: "16px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  message: { fontSize: "16px", color: "#555" },
  error: { fontSize: "16px", color: "red", fontWeight: "bold" },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    width: "90%",
    maxWidth: "480px",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#333",
  },
  modalTitle: { marginBottom: "4px", fontSize: "22px" },
  modalSubtitle: { color: "#666", marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "4px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  pricePreview: {
    background: "#f0f9f0",
    border: "1px solid #4caf50",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "14px",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  successBox: { textAlign: "center", padding: "20px" },
};
