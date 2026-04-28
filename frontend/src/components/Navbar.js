import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.wrapper}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand} aria-label="Go to home page">
          <span style={styles.brandBadge}>CR</span>
          <span>
            <span style={styles.brandEyebrow}>Car Rental</span>
            <strong style={styles.brandTitle}>DriveEase</strong>
          </span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={isActive("/") ? styles.activeLink : styles.link}>
            Home
          </Link>
          <Link to="/cars" style={isActive("/cars") ? styles.activeLink : styles.link}>
            Cars
          </Link>
        </div>

        <div style={styles.actions}>
          {!token ? (
            <Link to="/login" style={styles.loginButton}>
              Login / Register
            </Link>
          ) : (
            <>
              <div style={styles.userCard}>
                <span style={styles.userLabel}>Signed in as</span>
                <strong style={styles.userName}>{user?.name || "User"}</strong>
              </div>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  wrapper: {
    padding: "18px 24px 0",
    background: "#f8fafc",
  },
  nav: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "16px 20px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "22px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#ffffff",
    textDecoration: "none",
    minWidth: "fit-content",
  },
  brandBadge: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#eff6ff",
    fontWeight: "800",
    letterSpacing: "0.08em",
    boxShadow: "0 10px 24px rgba(37, 99, 235, 0.35)",
  },
  brandEyebrow: {
    display: "block",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "#93c5fd",
    marginBottom: "3px",
  },
  brandTitle: {
    display: "block",
    fontSize: "20px",
    color: "#f8fafc",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  link: {
    padding: "10px 14px",
    borderRadius: "999px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
    transition: "all 0.2s ease",
  },
  activeLink: {
    padding: "10px 14px",
    borderRadius: "999px",
    color: "#ffffff",
    background: "rgba(255,255,255,0.12)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  loginButton: {
    padding: "11px 16px",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#0f172a",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.16)",
  },
  userCard: {
    display: "grid",
    gap: "2px",
    padding: "10px 14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  userLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#93c5fd",
  },
  userName: {
    fontSize: "14px",
    color: "#f8fafc",
  },
  logoutButton: {
    padding: "11px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(248, 113, 113, 0.35)",
    background: "rgba(239, 68, 68, 0.14)",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
};

export default Navbar;
