// Profile.jsx - Complete Profile Page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, Building, Shield, Save, Edit, Lock, 
  ArrowLeft, CheckCircle, XCircle 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000/api";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch user data
  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          department: userData.department || ""
        });
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${userData.userId}/profile`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setEditMode(false);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${userData.userId}/password`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        toast.success("Password changed successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  // Get role display name
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

  // Get user initial
  const getInitial = () => {
    return userData?.fullName && userData.fullName.length > 0 
      ? userData.fullName.charAt(0).toUpperCase() 
      : "U";
  };

  if (loading && !userData) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      {/* Back Button */}
      <button 
        className="btn btn-outline-secondary mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="me-2" />
        Back
      </button>

      <div className="row">
        {/* Left Column - Profile Info */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              {/* Profile Avatar */}
              <div 
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '36px'
                }}
              >
                {getInitial()}
              </div>
              
              <h4 className="card-title">{userData?.fullName}</h4>
              <p className="text-muted mb-2">{userData?.email}</p>
              
              <div className="mb-3">
                <span className={`badge ${getRoleBadgeColor(userData?.role)} fs-6`}>
                  <Shield size={14} className="me-1" />
                  {getRoleDisplayName(userData?.role)}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="row text-center mt-4">
                <div className="col-6">
                  <div className="border-end">
                    <h5 className="mb-1">Active</h5>
                    <small className="text-success">
                      <CheckCircle size={16} className="me-1" />
                      Online
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <h5 className="mb-1">Member Since</h5>
                    <small className="text-muted">
                      {new Date().getFullYear()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="col-md-8">
          {/* Profile Information Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <User size={20} className="me-2" />
                Profile Information
              </h5>
              {!editMode ? (
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(true)}
                >
                  <Edit size={16} className="me-1" />
                  Edit Profile
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        fullName: userData.fullName || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        department: userData.department || ""
                      });
                    }}
                  >
                    <XCircle size={16} className="me-1" />
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleProfileUpdate}
                    disabled={loading}
                  >
                    <Save size={16} className="me-1" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Building size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <Lock size={20} className="me-2" />
                Change Password
              </h5>
              {!changePasswordMode ? (
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => setChangePasswordMode(true)}
                >
                  Change Password
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              {changePasswordMode ? (
                <form onSubmit={handlePasswordChange}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        {loading ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="text-muted mb-0">
                  Click the button above to change your password.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;