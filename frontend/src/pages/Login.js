import { useState } from "react";
import API from "../services/api";

localStorage.setItem("user", JSON.stringify(data.user));
localStorage.setItem("token", data.token);

if (data.user.role === "admin") {
  navigate("/admin-dashboard");
} else {
  navigate("/user-dashboard");
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👇 YAHI PAR YE FUNCTION LIKHNA HAI
  const handleLogin = () => {
    API.post("/login", { email, password })
      .then(res => {
        console.log("RESPONSE:", res.data); // DEBUG

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        alert("Login Successful");
      })
      .catch(err => {
        console.log("ERROR:", err);
        alert("Login Failed");
      });
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      {/* 👇 YAHA BUTTON CLICK PAR CALL HOGA */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;