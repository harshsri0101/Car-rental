import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        const { token, user } = res.data;

        if (user.role === "admin") {
          setError("Admins must login from the admin portal.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/cars");
        return;
      }

      await API.post("/auth/register", { name, email, password });
      alert("Account created. Please login.");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h1 style={styles.logo}>Car Rental</h1>
        <p style={styles.tagline}>Book your favorite cars instantly.</p>
        <div style={styles.adminLinkBox}>
          <p style={styles.adminText}>Are you an admin?</p>
          <Link to="/admin/login" style={styles.adminLink}>
            Go to Admin Portal
          </Link>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.badge}>Client Portal</div>
          <h2 style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={styles.subtitle}>
            {isLogin ? "Login to book your car" : "Join and start booking"}
          </p>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              style={styles.switchLink}
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #000, #1f2a40)",
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
  adminLinkBox: {
    marginTop: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  adminText: { color: "#ccc", fontSize: "13px", marginBottom: "8px" },
  adminLink: {
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
    background: "#2ecc71",
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
    background: "#2ecc71",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
  switchText: { marginTop: "15px", fontSize: "13px", color: "#ccc" },
  switchLink: {
    color: "#00c6ff",
    cursor: "pointer",
    marginLeft: "5px",
    fontWeight: "bold",
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
