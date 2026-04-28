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
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h1 style={styles.logo}>Admin Portal</h1>
        <p style={styles.tagline}>Manage cars, bookings, and users</p>
        <div style={styles.clientLinkBox}>
          <p style={styles.clientText}>Are you a client?</p>
          <Link to="/login" style={styles.clientLink}>
            Go to Client Portal
          </Link>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.badge}>Admin Portal</div>
          <h2 style={styles.title}>Admin Login</h2>
          <p style={styles.subtitle}>Authorized personnel only</p>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Please wait..." : "Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    color: "white",
  },
  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",
  },
  logo: { fontSize: "36px", marginBottom: "10px" },
  tagline: {
    fontSize: "16px",
    color: "#ccc",
    maxWidth: "300px",
    marginBottom: "40px",
  },
  clientLinkBox: {
    marginTop: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  clientText: { color: "#ccc", fontSize: "13px", marginBottom: "8px" },
  clientLink: {
    color: "#00c6ff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "380px",
    padding: "36px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#e74c3c",
    color: "#fff",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  title: { marginBottom: "5px", fontSize: "24px" },
  subtitle: { fontSize: "14px", color: "#ccc", marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "11px",
    margin: "7px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "11px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
  errorMsg: {
    background: "rgba(231,76,60,0.2)",
    border: "1px solid #e74c3c",
    color: "#ff6b6b",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "10px",
  },
};
