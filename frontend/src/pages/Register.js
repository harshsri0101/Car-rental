import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ✅ FIXED FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log(res.data);
      alert("User registered successfully ✅");

      navigate("/login"); // redirect

    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

      {/* ✅ FORM ADDED HERE */}
      <form onSubmit={handleRegister}>
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
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

        {/* ✅ IMPORTANT */}
        <button type="submit" style={styles.button}>
          Register 🚀
        </button>

      </form>
    </div>
  );
}

// simple styling
const styles = {
  container: {
    maxWidth: "300px",
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};