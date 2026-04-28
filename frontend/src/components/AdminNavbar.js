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
      <div>
        <p style={styles.eyebrow}>Fleetboard</p>
        <h2 style={styles.logo}>Admin Control</h2>
      </div>

      <div style={styles.links}>
        <Link to="/admin" style={styles.link}>
          Overview
        </Link>
        <Link to="/admin/cars" style={styles.link}>
          Fleet
        </Link>
        <Link to="/admin/add-car" style={styles.link}>
          Add Car
        </Link>
        <Link to="/admin/bookings" style={styles.link}>
          Bookings
        </Link>
        <button style={styles.logout} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px 30px",
    background: "#14202b",
    color: "#f7f1e7",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
  },
  eyebrow: {
    margin: "0 0 4px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#d4b182",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    color: "#e8edf3",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
  },
  logout: {
    background: "rgba(233, 89, 80, 0.12)",
    color: "#ffc3bd",
    border: "1px solid rgba(233, 89, 80, 0.35)",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
};
