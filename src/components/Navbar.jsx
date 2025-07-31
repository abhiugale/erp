import { Sun, Moon, Bell, User, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
const Navbar = () => {
  const { darkMode, setDarkMode, setShowMobileSidebar } = useTheme();
  const [name, setName] = useState("");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const decoded = jwtDecode(token);
  //     setName(decoded.name);
  //   }
  // }, []);

  return (
    <nav
      className={`navbar ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } px-4 border-bottom d-flex justify-content-between align-items-center`}
    >
      <div className="d-flex align-items-center gap-3 flex-grow-1">
        {/* Sidebar Toggle Button (Mobile only) */}
        <button
          className="btn btn-outline-secondary d-lg-none"
          onClick={() => setShowMobileSidebar(true)}
        >
          <Menu size={20} />
        </button>

        {/* Greeting */}
        <span className="fw-semibold d-none d-md-block">
          {name && (
            <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          )}
          <span>{name}</span>
        </span>

        {/* Search Bar */}
        <form className="d-none d-md-flex ms-3 w-100" role="search">
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Search modules..."
            aria-label="Search"
            style={{ maxWidth: "300px" }}
          />
        </form>
      </div>

      <div className="d-flex align-items-center gap-3">
        <Bell size={20} />
        <User size={20} />
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="themeSwitch"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label htmlFor="themeSwitch" className="form-check-label ms-2">
            {darkMode ? <Moon size={20} /> : <Sun size={18} />}
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
