// FacultyDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, Book, Award, User, GraduationCap, Building } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../services/api";

const FacultyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch faculty details from API
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching faculty details for ID: ${id}`);
        
        const response = await api.get(`/faculties/${id}`);
        console.log("Faculty data received:", response.data);
        
        setFaculty(response.data);
      } catch (error) {
        console.error("Error fetching faculty details:", error);
        setError(error.response?.data?.message || "Failed to load faculty details");
        toast.error("Failed to load faculty details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacultyDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading faculty details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger">
          <h5>Error Loading Faculty Details</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-warning">
          <h5>Faculty Not Found</h5>
          <p>The requested faculty member could not be found.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
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
        Back to Faculty List
      </button>

      {/* Faculty Profile Card */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Faculty Profile</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div 
                  className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {faculty.fullName?.charAt(0)?.toUpperCase() || 'F'}
                </div>
                <h4 className="card-title">{faculty.fullName}</h4>
                <span className="badge bg-success fs-6">{faculty.role || 'FACULTY'}</span>
              </div>

              <div className="faculty-info">
                <div className="d-flex align-items-center mb-2">
                  <User size={16} className="text-primary me-2" />
                  <strong>Employee No:</strong>
                  <span className="ms-2">{faculty.empNumber}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Mail size={16} className="text-primary me-2" />
                  <strong>Email:</strong>
                  <a href={`mailto:${faculty.email}`} className="ms-2 text-decoration-none">
                    {faculty.email}
                  </a>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Phone size={16} className="text-primary me-2" />
                  <strong>Phone:</strong>
                  <span className="ms-2">
                    {faculty.phone ? (
                      <a href={`tel:${faculty.phone}`} className="text-decoration-none">
                        {faculty.phone}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Building size={16} className="text-primary me-2" />
                  <strong>Department:</strong>
                  <span className="ms-2">{faculty.department}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <GraduationCap size={16} className="text-primary me-2" />
                  <strong>Qualification:</strong>
                  <span className="ms-2">{faculty.qualification}</span>
                </div>
                
                <div className="d-flex align-items-center">
                  <Calendar size={16} className="text-primary me-2" />
                  <strong>Join Date:</strong>
                  <span className="ms-2">
                    {faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* Professional Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Professional Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <div className="text-success mb-2">
                        <Building size={24} />
                      </div>
                      <h6>Department</h6>
                      <h4 className="text-success">{faculty.department}</h4>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <div className="text-info mb-2">
                        <User size={24} />
                      </div>
                      <h6>Employee ID</h6>
                      <h4 className="text-info">{faculty.empNumber}</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="card bg-warning">
                    <div className="card-body text-center">
                      <div className="text-white mb-2">
                        <GraduationCap size={24} />
                      </div>
                      <h6 className="text-white">Qualification</h6>
                      <h4 className="text-white">{faculty.qualification}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Employment Details */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Contact & Employment Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Contact Information</h6>
                  <p>
                    <strong>Email:</strong><br/>
                    <a href={`mailto:${faculty.email}`} className="text-decoration-none">
                      {faculty.email}
                    </a>
                  </p>
                  {faculty.phone && (
                    <p>
                      <strong>Phone:</strong><br/>
                      <a href={`tel:${faculty.phone}`} className="text-decoration-none">
                        {faculty.phone}
                      </a>
                    </p>
                  )}
                </div>
                
                <div className="col-md-6">
                  <h6>Employment Details</h6>
                  <p>
                    <strong>Department:</strong><br/>
                    {faculty.department}
                  </p>
                  <p>
                    <strong>Join Date:</strong><br/>
                    {faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <strong>Experience:</strong><br/>
                    {faculty.joinDate ? 
                      `${new Date().getFullYear() - new Date(faculty.joinDate).getFullYear()} years` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/faculties/${id}/edit`)}
                >
                  Edit Faculty
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => navigate(`/faculties/${id}/subjects`)}
                >
                  View Assigned Subjects
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate(`/faculties/${id}/schedule`)}
                >
                  View Teaching Schedule
                </button>
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => navigate(`/faculties/${id}/students`)}
                >
                  View Assigned Students
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => navigate(`/faculties/${id}/attendance`)}
                >
                  Manage Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Additional Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>System Information</h6>
                  <p>
                    <strong>Faculty ID:</strong> {faculty.facultyId}
                  </p>
                  <p>
                    <strong>Account Status:</strong> 
                    <span className="badge bg-success ms-2">Active</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Quick Actions</h6>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-sm btn-outline-primary">
                      Send Email
                    </button>
                    <button className="btn btn-sm btn-outline-info">
                      View Timetable
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetails;