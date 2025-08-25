import React, { useState } from "react";
import "../css/adminlogin.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AuthLogin = () => {
  // const admins = [
  //   {
  //     id: 1,
  //     name: "Admin",
  //     email: "admin@example.com",
  //     password: "123456",
  //   },
  // ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://192.168.1.14:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // "email" or "username"
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Save token to local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toUpperCase());

      // Redirect to dashboard
      navigate("/admin/main");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      <p>Enter your email and password to access your account</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email * </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password* </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
      {/* <p className="signup-text">
        Don't have an account? <Link to="/register">Register</Link>
      </p> */}
    </div>
  );
};

export default AuthLogin;
