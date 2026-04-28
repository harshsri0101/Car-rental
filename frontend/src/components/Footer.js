import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.topRow}>
        <div>
          <p style={styles.brand}>DriveEase</p>
          <p style={styles.text}>Simple car rental for smooth daily travel.</p>
        </div>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/cars" style={styles.link}>
            Cars
          </Link>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <span>© 2026 DriveEase</span>
        <span>Fast and clear car booking.</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "32px",
    padding: "24px 28px",
    borderRadius: "20px",
    background: "#0f172a",
    color: "#e2e8f0",
    border: "1px solid #1e293b",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
  },
  brand: {
    margin: "0 0 6px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
  },
  text: {
    margin: 0,
    fontSize: "14px",
    color: "#94a3b8",
  },
  links: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  link: {
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  bottomRow: {
    paddingTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    fontSize: "13px",
    color: "#94a3b8",
  },
};
