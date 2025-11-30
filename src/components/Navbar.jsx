// Navbar.jsx - Updated to work with your UserService
import { Sun, Moon, Bell, User, Menu, LogOut, Settings, Mail, Phone, Building, Shield } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const Navbar = () => {
  const { darkMode, setDarkMode, setShowMobileSidebar } = useTheme();
  const [userData, setUserData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch user data from backend
  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.sub || decoded.email;

      const response = await fetch(`${API_BASE}/users/email/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        // Also store in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user data");
        // Fallback to localStorage if available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileSettings = () => {
    setShowProfileDropdown(false);
    navigate("/admin/main/profile");
  };

  // Safe function to get initial
  const getInitial = () => {
    return userData?.fullName && userData.fullName.length > 0 
      ? userData.fullName.charAt(0).toUpperCase() 
      : "U";
  };

  // Get user role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'FACULTY': 'Faculty Member',
      'STUDENT': 'Student',
      'USER': 'User'
    };
    return roleMap[role] || role;
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    const colorMap = {
      'ADMIN': 'bg-danger',
      'FACULTY': 'bg-warning',
      'STUDENT': 'bg-info',
      'USER': 'bg-secondary'
    };
    return colorMap[role] || 'bg-secondary';
  };

  return (
    <nav
      className={`navbar ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } px-4 border-bottom d-flex justify-content-between align-items-center position-sticky`}
      style={{ zIndex: 1000, height: '70px' }}
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
        {userData?.fullName && (
          <span className="fw-semibold d-none d-md-block d-flex align-items-center">
            <div 
              className="d-inline-flex align-items-center justify-content-center me-2"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {getInitial()}
            </div>
            <span>Welcome, {userData.fullName.split(' ')[0]}</span>
          </span>
        )}

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
        {/* Notifications */}
        <div className="position-relative">
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.6rem' }}
          >
            3
          </span>
        </div>
        
        {/* User Profile with Dropdown */}
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-link p-0 border-0 d-flex align-items-center gap-2"
            onClick={toggleProfileDropdown}
            style={{ 
              color: 'inherit', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#007bff',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                border: `2px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                transition: 'all 0.2s ease'
              }}
            >
              {getInitial()}
            </div>
            <span className="d-none d-md-inline">{userData?.fullName?.split(' ')[0]}</span>
          </button>
          
          {/* Custom Dropdown Menu */}
          {showProfileDropdown && (
            <div 
              style={{ 
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                minWidth: '300px',
                zIndex: 1050,
                backgroundColor: darkMode ? '#343a40' : 'white',
                border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                padding: '0',
                overflow: 'hidden'
              }}
            >
              {/* Profile Header */}
              <div style={{ 
                padding: '20px 16px',
                borderBottom: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                backgroundColor: darkMode ? '#2b3035' : '#f8f9fa'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      flexShrink: 0
                    }}
                  >
                    {getInitial()}
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      color: darkMode ? 'white' : 'black',
                      marginBottom: '4px'
                    }}>
                      {userData?.fullName || "User"}
                    </div>
                    
                    <div className="d-flex align-items-center gap-1 mb-2">
                      <Shield size={14} className={getRoleBadgeColor(userData?.role).replace('bg-', 'text-')} />
                      <span className={`badge ${getRoleBadgeColor(userData?.role)}`}>
                        {getRoleDisplayName(userData?.role)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-1 mb-1">
                      <Mail size={12} className="text-muted" />
                      <small style={{ 
                        fontSize: '12px', 
                        color: darkMode ? '#adb5bd' : '#6c757d'
                      }}>
                        {userData?.email || "No email"}
                      </small>
                    </div>
                    
                    {userData?.phone && (
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <Phone size={12} className="text-muted" />
                        <small style={{ 
                          fontSize: '12px', 
                          color: darkMode ? '#adb5bd' : '#6c757d'
                        }}>
                          {userData.phone}
                        </small>
                      </div>
                    )}
                    
                    {userData?.department && (
                      <div className="d-flex align-items-center gap-1">
                        <Building size={12} className="text-muted" />
                        <small style={{ 
                          fontSize: '12px', 
                          color: darkMode ? '#adb5bd' : '#6c757d'
                        }}>
                          {userData.department}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropdown Items */}
              <div style={{ padding: '8px 0' }}>
                <button 
                  className="w-100 border-0 bg-transparent d-flex align-items-center gap-3"
                  onClick={handleProfileSettings}
                  style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: darkMode ? 'white' : 'black',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#495057' : '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Settings size={18} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Profile Settings</div>
                    <small style={{ 
                      fontSize: '12px', 
                      color: darkMode ? '#adb5bd' : '#6c757d'
                    }}>
                      Manage your account
                    </small>
                  </div>
                </button>

                <div style={{ 
                  height: '1px',
                  backgroundColor: darkMode ? '#495057' : '#dee2e6',
                  margin: '4px 0'
                }} />

                <button 
                  className="w-100 border-0 bg-transparent d-flex align-items-center gap-3"
                  onClick={handleLogout}
                  style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#dc3545',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#495057' : '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Logout</div>
                    <small style={{ 
                      fontSize: '12px', 
                      color: '#dc3545'
                    }}>
                      Sign out of your account
                    </small>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="form-check form-switch d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="themeSwitch"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label htmlFor="themeSwitch" className="form-check-label ms-2" style={{ cursor: 'pointer' }}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;