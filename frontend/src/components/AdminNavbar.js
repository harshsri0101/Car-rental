import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🚗 Admin Panel</h2>
      <div style={styles.links}>
        <Link to="/admin" style={styles.link}>📊 Dashboard</Link>
        <Link to="/admin/cars" style={styles.link}>🚗 Cars</Link>
        <Link to="/admin/add-car" style={styles.link}>➕ Add Car</Link>
        <Link to="/admin/bookings" style={styles.link}>📋 Bookings</Link>
        <button style={styles.logout} onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "#1a1a2e",
    color: "#fff",
  },
  logo: { margin: 0, fontSize: "20px" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  logout: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
};