import React, { useState } from "react";
import "../css/adminlogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password,
      });

      const data = response.data;
      console.log("Login response:", data);
      
      // Save ALL user data in localStorage including userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId.toString()); // Convert to string
      localStorage.setItem("role", data.role.toUpperCase());
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      
      console.log("Stored userId:", localStorage.getItem("userId")); // Debug log
      
      toast.success("Login successful!");

      setTimeout(() => {
        const role = data.role.toUpperCase();

        if (role === "ADMIN") {
          navigate("/admin/main/admindashboard");
        } else if (role === "STUDENT") {
          navigate("/student/main/studentdashboard");
        } else if (role === "FACULTY") {
          navigate("/faculty/main/facultydashboard");
        } else {
          navigate("/unauthorized");
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      if (err.response && err.response.status === 403) {
        toast.error("Access denied! You are not authorized.");
      } else if (err.response && err.response.status === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error("Login failed. Please check your connection or server.");
      }
    }
  };

  return (
    <div className="login-container text-dark">
      <h1>Welcome Back</h1>
      <p>Enter your email and password to access your account</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            className="bg-dark text-white"
            value={password}
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn bg-success">
          Login
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default AuthLogin;