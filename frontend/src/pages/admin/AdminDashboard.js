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

function CarModal({ title, form, setForm, onClose, onSubmit, saving }) {
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            X
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
            Available for booking
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

      setBookings(bookingsRes.data);
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

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      fetchAll();
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
      label: "Active Bookings",
      value: bookings.filter((booking) => booking.status === "confirmed").length,
    },
  ];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin</h2>
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
        <h1 style={styles.heading}>Admin Dashboard</h1>

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
                <h2>All Bookings</h2>
                <div style={styles.list}>
                  {bookings.map((booking) => (
                    <div key={booking._id} style={styles.listCard}>
                      <p>User: {booking.userId?.name || booking.name || "N/A"}</p>
                      <p>Car: {booking.carId?.name || "N/A"}</p>
                      <p>Status: {booking.status}</p>
                      <p>
                        Dates:{" "}
                        {booking.fromDate
                          ? new Date(booking.fromDate).toLocaleDateString()
                          : "N/A"}{" "}
                        to{" "}
                        {booking.toDate
                          ? new Date(booking.toDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <div style={styles.actionRow}>
                        <button
                          style={styles.primaryButton}
                          onClick={() =>
                            updateBookingStatus(booking._id, "confirmed")
                          }
                        >
                          Confirm
                        </button>
                        <button
                          style={styles.dangerButton}
                          onClick={() =>
                            updateBookingStatus(booking._id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "cars" && (
              <section style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2>Manage Cars</h2>
                  <button style={styles.primaryButton} onClick={openAddModal}>
                    Add Car
                  </button>
                </div>

                <div style={styles.list}>
                  {cars.map((car) => (
                    <div key={car._id} style={styles.listCard}>
                      <p>Name: {car.name}</p>
                      <p>Brand: {car.brand}</p>
                      <p>Model: {car.model || "N/A"}</p>
                      <p>Price: Rs. {Number.isFinite(getCarPrice(car)) ? getCarPrice(car) : "--"}</p>
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
                  ))}
                </div>
              </section>
            )}

            {tab === "users" && (
              <section style={styles.section}>
                <h2>Users</h2>
                <div style={styles.list}>
                  {users.map((user) => (
                    <div key={user._id} style={styles.listCard}>
                      <p>Name: {user.name}</p>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role}</p>
                      <p>
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
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
    background: "#0f172a",
    color: "#e2e8f0",
  },
  sidebar: {
    padding: "24px 16px",
    borderRight: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#111827",
  },
  sidebarTitle: {
    margin: "0 0 12px",
  },
  navButton: {
    padding: "10px 12px",
    background: "transparent",
    border: "1px solid #334155",
    color: "#cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  activeNavButton: {
    padding: "10px 12px",
    background: "#2563eb",
    border: "1px solid #2563eb",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  logoutButton: {
    marginTop: "auto",
    padding: "10px 12px",
    background: "#7f1d1d",
    border: "1px solid #7f1d1d",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    padding: "32px",
  },
  heading: {
    marginTop: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "20px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
  },
  statLabel: {
    color: "#94a3b8",
    marginTop: "6px",
  },
  section: {
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  listCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },
  primaryButton: {
    padding: "10px 14px",
    background: "#2563eb",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    background: "transparent",
    border: "1px solid #475569",
    color: "#e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 14px",
    background: "#dc2626",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  modal: {
    width: "100%",
    maxWidth: "760px",
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    padding: "24px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  modalTitle: {
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    border: "1px solid #475569",
    color: "#e2e8f0",
    borderRadius: "8px",
    padding: "8px 10px",
    cursor: "pointer",
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
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e2e8f0",
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
  },
};
