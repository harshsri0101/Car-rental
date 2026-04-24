import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5002/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  car:      "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5M16 17h2M5 17h6m5 0a2 2 0 100 4 2 2 0 000-4zM7 17a2 2 0 100 4 2 2 0 000-4z",
  booking:  "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus:     "M12 5v14M5 12h14",
  edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  close:    "M18 6L6 18M6 6l12 12",
  check:    "M20 6L9 17l-5-5",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  dashboard:"M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
      <div style={{ ...styles.statIcon, background: color + "22", color }}>
        <Icon d={Icons[icon]} size={22} />
      </div>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <Icon d={Icons.close} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── CAR FORM ─────────────────────────────────────────────────────────────────
function CarForm({ initial = {}, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    brand: initial.brand || "",
    price: initial.price || "",
    category: initial.category || "Sedan",
    seats: initial.seats || "",
    fuel: initial.fuel || "Petrol",
    image: initial.image || "",
    available: initial.available !== false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price) {
      setErr("Name, brand, and price are required!"); return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save car");
    } finally { setSaving(false); }
  };

  return (
    <div style={styles.formGrid}>
      {err && <div style={{ ...styles.errBanner, gridColumn: "1/-1" }}>{err}</div>}
      {[
        ["name", "Car Name", "text"],
        ["brand", "Brand", "text"],
        ["price", "Price / Day (₹)", "number"],
        ["seats", "Seats", "number"],
        ["image", "Image URL", "text"],
      ].map(([k, ph, t]) => (
        <div key={k} style={k === "image" ? { gridColumn: "1/-1" } : {}}>
          <label style={styles.formLabel}>{ph}</label>
          <input type={t} value={form[k]} onChange={e => set(k, e.target.value)}
            style={styles.formInput} placeholder={ph} />
        </div>
      ))}
      <div>
        <label style={styles.formLabel}>Category</label>
        <select value={form.category} onChange={e => set("category", e.target.value)} style={styles.formInput}>
          {["Sedan", "SUV", "Hatchback", "Luxury", "Electric"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={styles.formLabel}>Fuel Type</label>
        <select value={form.fuel} onChange={e => set("fuel", e.target.value)} style={styles.formInput}>
          {["Petrol", "Diesel", "Electric", "Hybrid"].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" id="avail" checked={form.available}
          onChange={e => set("available", e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="avail" style={styles.formLabel}>Available for booking</label>
      </div>
      <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={styles.btnSecondary}>Cancel</button>
        <button onClick={handleSave} style={styles.btnPrimary} disabled={saving}>
          {saving ? "Saving..." : "💾 Save Car"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carModal, setCarModal] = useState(null); // null | "add" | car object
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, c, u] = await Promise.all([
        axios.get(`${API_BASE}/bookings`, getAuthHeader()),
        axios.get(`${API_BASE}/cars`, getAuthHeader()),
        axios.get(`${API_BASE}/users`, getAuthHeader()),
      ]);
      setBookings(b.data);
      setCars(c.data);
      setUsers(u.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddCar = async (form) => {
    await axios.post(`${API_BASE}/cars`, form, getAuthHeader());
    showToast("✅ Car added successfully!");
    fetchAll();
  };

  const handleEditCar = async (form) => {
    await axios.put(`${API_BASE}/cars/${carModal._id}`, form, getAuthHeader());
    showToast("✅ Car updated successfully!");
    fetchAll();
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    await axios.delete(`${API_BASE}/cars/${id}`, getAuthHeader());
    showToast("🗑️ Car deleted!");
    fetchAll();
  };

  const handleBookingStatus = async (id, status) => {
    await axios.put(`${API_BASE}/bookings/${id}`, { status }, getAuthHeader());
    showToast(`✅ Booking marked as ${status}`);
    fetchAll();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "booking", color: "#6c63ff" },
    { label: "Total Cars", value: cars.length, icon: "car", color: "#00c6a0" },
    { label: "Total Users", value: users.length, icon: "users", color: "#f39c12" },
    { label: "Active Bookings", value: bookings.filter(b => b.status === "confirmed").length, icon: "check", color: "#e74c3c" },
  ];

  return (
    <div style={styles.root}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>🚗 CarAdmin</div>
        <nav style={styles.nav}>
          {[
            { id: "bookings", label: "Bookings", icon: "booking" },
            { id: "cars",     label: "Manage Cars", icon: "car" },
            { id: "users",    label: "Users", icon: "users" },
          ].map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ ...styles.navBtn, ...(tab === id ? styles.navBtnActive : {}) }}>
              <Icon d={Icons[icon]} size={16} />
              {label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <Icon d={Icons.logout} size={16} /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Admin Dashboard</h1>
            <p style={styles.subheading}>Welcome back, Admin 👋</p>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsRow}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {loading ? (
          <div style={styles.loader}>Loading data...</div>
        ) : (
          <>
            {/* ── BOOKINGS TAB ── */}
            {tab === "bookings" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>📋 All Bookings</h2>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["User", "Car", "From", "To", "Status", "Actions"].map(h => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td colSpan={6} style={styles.empty}>No bookings yet</td></tr>
                      ) : bookings.map(b => (
                        <tr key={b._id} style={styles.tr}>
                          <td style={styles.td}>{b.user?.name || b.user?.email || "N/A"}</td>
                          <td style={styles.td}>{b.car?.name || "N/A"}</td>
                          <td style={styles.td}>{b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}</td>
                          <td style={styles.td}>{b.endDate ? new Date(b.endDate).toLocaleDateString() : "—"}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, ...statusColor(b.status) }}>
                              {b.status || "pending"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button style={styles.actionBtn("#00c6a0")}
                                onClick={() => handleBookingStatus(b._id, "confirmed")}>✔ Confirm</button>
                              <button style={styles.actionBtn("#e74c3c")}
                                onClick={() => handleBookingStatus(b._id, "cancelled")}>✖ Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── CARS TAB ── */}
            {tab === "cars" && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>🚗 Manage Cars</h2>
                  <button style={styles.btnPrimary} onClick={() => setCarModal("add")}>
                    <Icon d={Icons.plus} size={15} /> Add Car
                  </button>
                </div>
                <div style={styles.carsGrid}>
                  {cars.length === 0 ? (
                    <div style={styles.empty}>No cars added yet</div>
                  ) : cars.map(car => (
                    <div key={car._id} style={styles.carCard}>
                      <div style={styles.carImgWrap}>
                        {car.image
                          ? <img src={car.image} alt={car.name} style={styles.carImg} />
                          : <div style={styles.carImgPlaceholder}>🚗</div>
                        }
                        <span style={{ ...styles.badge, ...( car.available ? styles.green : styles.red), position:"absolute", top:8, right:8 }}>
                          {car.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div style={styles.carInfo}>
                        <div style={styles.carName}>{car.name}</div>
                        <div style={styles.carBrand}>{car.brand} · {car.category}</div>
                        <div style={styles.carPrice}>₹{car.price}/day</div>
                        <div style={styles.carMeta}>{car.seats} seats · {car.fuel}</div>
                      </div>
                      <div style={styles.carActions}>
                        <button style={styles.iconBtn("#6c63ff")} onClick={() => setCarModal(car)}>
                          <Icon d={Icons.edit} size={15} /> Edit
                        </button>
                        <button style={styles.iconBtn("#e74c3c")} onClick={() => handleDeleteCar(car._id)}>
                          <Icon d={Icons.trash} size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === "users" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>👥 All Users</h2>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["Name", "Email", "Role", "Joined"].map(h => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={4} style={styles.empty}>No users found</td></tr>
                      ) : users.map(u => (
                        <tr key={u._id} style={styles.tr}>
                          <td style={styles.td}>{u.name}</td>
                          <td style={styles.td}>{u.email}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, ...(u.role === "admin" ? styles.purple : styles.blue) }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      {carModal && (
        <Modal
          title={carModal === "add" ? "➕ Add New Car" : `✏️ Edit — ${carModal.name}`}
          onClose={() => setCarModal(null)}
        >
          <CarForm
            initial={carModal === "add" ? {} : carModal}
            onSave={carModal === "add" ? handleAddCar : handleEditCar}
            onClose={() => setCarModal(null)}
          />
        </Modal>
      )}

      {/* TOAST */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const statusColor = (s) => ({
  confirmed: { background: "#00c6a022", color: "#00c6a0", border: "1px solid #00c6a044" },
  cancelled:  { background: "#e74c3c22", color: "#e74c3c", border: "1px solid #e74c3c44" },
  pending:    { background: "#f39c1222", color: "#f39c12", border: "1px solid #f39c1244" },
}[s] || { background: "#ffffff22", color: "#ccc" });

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#0d1117", color: "#e6edf3",
  },
  sidebar: {
    width: 220, background: "#161b22",
    borderRight: "1px solid #30363d",
    display: "flex", flexDirection: "column",
    padding: "24px 12px", position: "sticky", top: 0, height: "100vh",
  },
  sidebarLogo: {
    fontSize: 20, fontWeight: 700, color: "#fff",
    padding: "0 12px 24px", borderBottom: "1px solid #30363d", marginBottom: 16,
  },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: 8, border: "none",
    background: "transparent", color: "#8b949e",
    cursor: "pointer", fontSize: 14, textAlign: "left",
    transition: "all 0.2s",
  },
  navBtnActive: { background: "#6c63ff22", color: "#6c63ff" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: 8, border: "none",
    background: "transparent", color: "#e74c3c",
    cursor: "pointer", fontSize: 14,
  },
  main: { flex: 1, padding: "32px", overflowY: "auto" },
  header: { marginBottom: 28 },
  heading: { fontSize: 26, fontWeight: 700, margin: 0 },
  subheading: { color: "#8b949e", marginTop: 4, fontSize: 14 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 },
  statCard: {
    background: "#161b22", borderRadius: 12,
    padding: "20px", display: "flex", alignItems: "center", gap: 16,
    border: "1px solid #30363d",
  },
  statIcon: { padding: 12, borderRadius: 10 },
  statValue: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 12, color: "#8b949e", marginTop: 2 },
  section: { background: "#161b22", borderRadius: 12, border: "1px solid #30363d", padding: 24 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { margin: 0, fontSize: 18, fontWeight: 600 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8b949e", borderBottom: "1px solid #30363d", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #21262d" },
  td: { padding: "14px 16px", fontSize: 14, verticalAlign: "middle" },
  empty: { padding: 40, textAlign: "center", color: "#8b949e", fontSize: 14 },
  badge: { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  green:  { background: "#00c6a022", color: "#00c6a0", border: "1px solid #00c6a044" },
  red:    { background: "#e74c3c22", color: "#e74c3c", border: "1px solid #e74c3c44" },
  blue:   { background: "#3498db22", color: "#3498db", border: "1px solid #3498db44" },
  purple: { background: "#6c63ff22", color: "#6c63ff", border: "1px solid #6c63ff44" },
  actionBtn: (c) => ({
    padding: "5px 12px", borderRadius: 6, border: `1px solid ${c}44`,
    background: c + "22", color: c, cursor: "pointer", fontSize: 12, fontWeight: 600,
  }),
  iconBtn: (c) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", borderRadius: 6, border: `1px solid ${c}44`,
    background: c + "22", color: c, cursor: "pointer", fontSize: 12, fontWeight: 600,
  }),
  carsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 16 },
  carCard: {
    background: "#0d1117", borderRadius: 10, border: "1px solid #30363d",
    overflow: "hidden",
  },
  carImgWrap: { position: "relative", height: 150, background: "#21262d" },
  carImg: { width: "100%", height: "100%", objectFit: "cover" },
  carImgPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48 },
  carInfo: { padding: "14px 16px" },
  carName: { fontWeight: 700, fontSize: 16 },
  carBrand: { color: "#8b949e", fontSize: 12, marginTop: 2 },
  carPrice: { color: "#00c6a0", fontWeight: 700, fontSize: 15, marginTop: 6 },
  carMeta: { color: "#8b949e", fontSize: 12, marginTop: 4 },
  carActions: { display: "flex", gap: 8, padding: "0 16px 14px" },
  btnPrimary: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "9px 18px", borderRadius: 8, border: "none",
    background: "#6c63ff", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
  },
  btnSecondary: {
    padding: "9px 18px", borderRadius: 8,
    border: "1px solid #30363d", background: "transparent",
    color: "#8b949e", cursor: "pointer", fontSize: 14,
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal: {
    background: "#161b22", borderRadius: 14, border: "1px solid #30363d",
    width: "90%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
    padding: 28,
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  closeBtn: { background: "none", border: "none", color: "#8b949e", cursor: "pointer", padding: 4 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  formLabel: { display: "block", fontSize: 12, color: "#8b949e", marginBottom: 5 },
  formInput: {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #30363d", background: "#0d1117",
    color: "#e6edf3", fontSize: 14, boxSizing: "border-box",
    outline: "none",
  },
  errBanner: {
    background: "#e74c3c22", border: "1px solid #e74c3c44",
    color: "#e74c3c", padding: "10px 14px", borderRadius: 8, fontSize: 13,
  },
  loader: { textAlign: "center", padding: 60, color: "#8b949e", fontSize: 16 },
  toast: {
    position: "fixed", bottom: 28, right: 28,
    background: "#161b22", border: "1px solid #30363d",
    color: "#e6edf3", padding: "12px 20px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, zIndex: 200,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
};
