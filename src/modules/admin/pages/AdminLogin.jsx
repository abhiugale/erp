import React, { useState } from "react";
import "../../../css/adminlogin.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const admins = [
    {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      password: "123456",
    },
  ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const matchedAdmin = admins.find(
      (admin) => admin.email === email && admin.password === password
    );
    if (matchedAdmin) {
      const token = admins.id;
      localStorage.setItem("token", token);
      
      navigate("/main");
    } else {
      window.alert("Invalid username or password");
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
          Submit
        </button>
      </form>
      {/* <p className="signup-text">
        Don't have an account? <Link to="/register">Register</Link>
      </p> */}
    </div>
  );
};

export default AdminLogin;
