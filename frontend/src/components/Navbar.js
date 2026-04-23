import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // active link style
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      
      {/* LEFT */}
      <div>
        <Link to="/" style={isActive("/") ? styles.activeLink : styles.link}>
          Home
        </Link>

        <Link to="/cars" style={isActive("/cars") ? styles.activeLink : styles.link}>
          Cars
        </Link>

        {token && (
          <Link
            to="/my-bookings"
            style={isActive("/my-bookings") ? styles.activeLink : styles.link}
          >
            My Bookings
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div>
        {!token ? (
          <Link to="/auth" style={styles.link}>
            Login / Register
          </Link>
        ) : (
          <>
            <span style={{ marginRight: "10px" }}>
              👋 {user?.name || "User"}
            </span>

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}

// 🎨 Styles
const styles = {
  nav: {
    padding: "12px 20px",
    background: "#111",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  link: {
    marginRight: "15px",
    color: "#fff",
    textDecoration: "none"
  },
  activeLink: {
    marginRight: "15px",
    color: "yellow",
    textDecoration: "underline"
  },
  button: {
    padding: "6px 12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Navbar;