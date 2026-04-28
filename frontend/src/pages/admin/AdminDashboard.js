import React, { useEffect, useState } from "react";
import API from "../../services/api";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

const initialForm = {
  name: "",
  brand: "",
  model: "",
  year: "",
  pricePerDay: "",
  fuelType: "Petrol",
  transmission: "Manual",
  seats: "",
  image: "",
  location: "",
  description: "",
  available: true,
};

function formatCurrency(value) {
  return Number.isFinite(value) ? `Rs. ${value}` : "Rs. --";
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN") : "N/A";
}

function getVisibleBookings(bookings) {
  return bookings.filter(
    (booking) => booking.status !== "cancelled" && booking.status !== "confirmed"
  );
}

function CarModal({ title, form, setForm, onClose, onSubmit, saving }) {
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button onClick={onClose} style={styles.secondaryButton}>
            Close
          </button>
        </div>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Car name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Model"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Year"
            type="number"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Price per day"
            type="number"
            value={form.pricePerDay}
            onChange={(e) => update("pricePerDay", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Seats"
            type="number"
            value={form.seats}
            onChange={(e) => update("seats", e.target.value)}
          />
          <select
            style={styles.input}
            value={form.fuelType}
            onChange={(e) => update("fuelType", e.target.value)}
          >
            {["Petrol", "Diesel", "Electric", "Hybrid"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            style={styles.input}
            value={form.transmission}
            onChange={(e) => update("transmission", e.target.value)}
          >
            {["Manual", "Automatic"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input
            style={{ ...styles.input, gridColumn: "1 / -1" }}
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => update("available", e.target.checked)}
            />
            Available
          </label>
          <textarea
            style={{ ...styles.input, ...styles.textarea, gridColumn: "1 / -1" }}
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div style={styles.modalActions}>
          <button style={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.primaryButton} onClick={onSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bookingsRes, carsRes, usersRes] = await Promise.all([
        API.get("/bookings"),
        API.get("/cars"),
        API.get("/users"),
      ]);

      setBookings(getVisibleBookings(bookingsRes.data));
      setCars(carsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetModal = () => {
    setModalOpen(false);
    setEditingCarId(null);
    setForm(initialForm);
  };

  const openAddModal = () => {
    setEditingCarId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCarId(car._id);
    setForm({
      name: car.name || "",
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      pricePerDay: car.pricePerDay ?? car.price ?? "",
      fuelType: car.fuelType || "Petrol",
      transmission: car.transmission || "Manual",
      seats: car.seats || "",
      image: car.image || "",
      location: car.location || "",
      description: car.description || "",
      available: car.available !== false,
    });
    setModalOpen(true);
  };

  const buildCarPayload = () => ({
    ...form,
    year: form.year ? Number(form.year) : undefined,
    pricePerDay: Number(form.pricePerDay),
    seats: form.seats ? Number(form.seats) : undefined,
  });

  const saveCar = async () => {
    if (!form.name || !form.brand || !form.pricePerDay) {
      alert("Name, brand, and price per day are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildCarPayload();

      if (editingCarId) {
        await API.put(`/cars/${editingCarId}`, payload);
      } else {
        await API.post("/cars", payload);
      }

      resetModal();
      fetchAll();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save car");
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) {
      return;
    }

    try {
      await API.delete(`/cars/${id}`);
      fetchAll();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete car");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);
      setUsers((current) => current.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await API.put(`/bookings/${id}`, { status });
      const updatedBooking = response.data?.booking;

      if (updatedBooking) {
        setBookings((current) => {
          if (status === "cancelled" || status === "confirmed") {
            return current.filter((booking) => booking._id !== id);
          }

          return current.map((booking) =>
            booking._id === id ? { ...booking, ...updatedBooking } : booking
          );
        });
      } else {
        fetchAll();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update booking");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  const stats = [
    { label: "Bookings", value: bookings.length },
    { label: "Cars", value: cars.length },
    { label: "Users", value: users.length },
    {
      label: "Confirmed",
      value: bookings.filter((booking) => booking.status === "confirmed").length,
    },
  ];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Dashboard</h2>

        <button
          style={tab === "bookings" ? styles.activeNavButton : styles.navButton}
          onClick={() => setTab("bookings")}
        >
          Bookings
        </button>
        <button
          style={tab === "cars" ? styles.activeNavButton : styles.navButton}
          onClick={() => setTab("cars")}
        >
          Cars
        </button>
        <button
          style={tab === "users" ? styles.activeNavButton : styles.navButton}
          onClick={() => setTab("users")}
        >
          Users
        </button>

        <button style={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subheading}>Manage bookings, cars, and users.</p>
          </div>

          <div style={styles.headerActions}>
            <button style={styles.secondaryButton} onClick={fetchAll}>
              Refresh
            </button>
            <button style={styles.primaryButton} onClick={openAddModal}>
              Add Car
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {tab === "bookings" && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Bookings</h2>
                <div style={styles.list}>
                  {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking._id} style={styles.listCard}>
                        <p>Username: {booking.userId?.name || "N/A"}</p>
                        <p>Booking Name: {booking.name || "N/A"}</p>
                        <p>Email: {booking.userId?.email || booking.email || "N/A"}</p>
                        <p>Mobile: {booking.phone || "N/A"}</p>
                        <p>Car: {booking.carId?.name || "N/A"}</p>
                        <p>Status: {booking.status}</p>
                        <p>
                          Dates: {formatDate(booking.fromDate)} to{" "}
                          {formatDate(booking.toDate)}
                        </p>
                        <p>Total: {formatCurrency(Number(booking.totalPrice))}</p>
                        <div style={styles.actionRow}>
                          <button
                            style={styles.primaryButton}
                            onClick={() => updateBookingStatus(booking._id, "confirmed")}
                          >
                            Confirm
                          </button>
                          <button
                            style={styles.dangerButton}
                            onClick={() => updateBookingStatus(booking._id, "cancelled")}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {tab === "cars" && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Cars</h2>
                <div style={styles.list}>
                  {cars.length === 0 ? (
                    <p>No cars found.</p>
                  ) : (
                    cars.map((car) => (
                      <div key={car._id} style={styles.listCard}>
                        <p>Name: {car.name}</p>
                        <p>Brand: {car.brand}</p>
                        <p>Model: {car.model || "N/A"}</p>
                        <p>Price: {formatCurrency(getCarPrice(car))}</p>
                        <p>
                          Details: {car.seats || "N/A"} seats, {car.fuelType || "N/A"},{" "}
                          {car.transmission || "N/A"}
                        </p>
                        <div style={styles.actionRow}>
                          <button
                            style={styles.primaryButton}
                            onClick={() => openEditModal(car)}
                          >
                            Edit
                          </button>
                          <button
                            style={styles.dangerButton}
                            onClick={() => deleteCar(car._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {tab === "users" && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Users</h2>
                <div style={styles.list}>
                  {users.length === 0 ? (
                    <p>No users found.</p>
                  ) : (
                    users.map((user) => (
                      <div key={user._id} style={styles.listCard}>
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <p>Joined: {formatDate(user.createdAt)}</p>
                        <div style={styles.actionRow}>
                          <button
                            style={styles.dangerButton}
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <CarModal
          title={editingCarId ? "Edit Car" : "Add Car"}
          form={form}
          setForm={setForm}
          onClose={resetModal}
          onSubmit={saveCar}
          saving={saving}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    minHeight: "100vh",
    background: "#f5f5f5",
    color: "#111827",
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sidebarTitle: {
    margin: "0 0 12px",
    fontSize: "22px",
  },
  navButton: {
    padding: "10px 12px",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    color: "#111827",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  activeNavButton: {
    padding: "10px 12px",
    background: "#111827",
    border: "1px solid #111827",
    color: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  logoutButton: {
    marginTop: "auto",
    padding: "10px 12px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "28px",
  },
  subheading: {
    margin: 0,
    color: "#6b7280",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
  },
  statLabel: {
    color: "#6b7280",
    marginTop: "6px",
  },
  section: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  listCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "10px 14px",
    background: "#111827",
    border: "none",
    color: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    color: "#111827",
    borderRadius: "8px",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 14px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "8px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  modal: {
    width: "100%",
    maxWidth: "760px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  modalTitle: {
    margin: 0,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: "90px",
    resize: "vertical",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },
};
