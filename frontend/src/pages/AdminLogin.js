import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (user.role !== "admin") {
        setError("You are not authorized as admin.");
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.sideNote}>
          <p style={styles.eyebrow}>Admin Portal</p>
          <h1 style={styles.heroTitle}>Manage bookings, cars, and users.</h1>
          <p style={styles.heroText}>
            Sign in with your admin account to open the dashboard.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Admin login</h2>
          <p style={styles.subtitle}>Use your admin account to continue.</p>

          {error ? <div style={styles.errorBox}>{error}</div> : null}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.field}>
              <span style={styles.label}>Email</span>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Password</span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </label>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.footerText}>Need the customer side?</span>
            <Link to="/login" style={styles.link}>
              Go to client login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "linear-gradient(180deg, #eef2f7 0%, #f8fafc 45%, #edf1f5 100%)",
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
  },
  shell: {
    width: "100%",
    maxWidth: "920px",
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: "32px",
    alignItems: "center",
  },
  sideNote: {
    padding: "12px",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  heroTitle: {
    margin: "0 0 14px",
    fontSize: "42px",
    lineHeight: 1.1,
    color: "#0f172a",
    maxWidth: "420px",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "420px",
  },
  card: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "34px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: "28px",
    color: "#111827",
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#6b7280",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#111827",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
  },
  button: {
    marginTop: "4px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  errorBox: {
    marginBottom: "18px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
  },
  footer: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#6b7280",
  },
  link: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f766e",
    textDecoration: "none",
  },
  "@media (max-width: 820px)": {},
};
