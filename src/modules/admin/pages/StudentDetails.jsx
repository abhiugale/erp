// StudentDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, Book, Award, MapPin } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../services/api";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student details from API
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching student details for ID: ${id}`);
        
        const response = await api.get(`/students/${id}`);
        console.log("Student data received:", response.data);
        
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError(error.response?.data?.message || "Failed to load student details");
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading student details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger">
          <h5>Error Loading Student Details</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-warning">
          <h5>Student Not Found</h5>
          <p>The requested student could not be found.</p>
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
        Back to Student List
      </button>

      {/* Student Profile Card */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Student Profile</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div 
                  className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {student.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <h4 className="card-title">{student.name}</h4>
                <span className="badge bg-success fs-6">{student.role || 'STUDENT'}</span>
              </div>

              <div className="student-info">
                <div className="d-flex align-items-center mb-2">
                  <Award size={16} className="text-primary me-2" />
                  <strong>PRN:</strong>
                  <span className="ms-2">{student.studentPrn}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Mail size={16} className="text-primary me-2" />
                  <strong>Email:</strong>
                  <a href={`mailto:${student.email}`} className="ms-2 text-decoration-none">
                    {student.email}
                  </a>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Phone size={16} className="text-primary me-2" />
                  <strong>Phone:</strong>
                  <span className="ms-2">
                    {student.phone ? (
                      <a href={`tel:${student.phone}`} className="text-decoration-none">
                        {student.phone}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <MapPin size={16} className="text-primary me-2" />
                  <strong>Department:</strong>
                  <span className="ms-2">{student.department}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <Book size={16} className="text-primary me-2" />
                  <strong>Semester:</strong>
                  <span className="badge bg-info ms-2">Semester {student.semester}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <strong>Section:</strong>
                  <span className="badge bg-secondary ms-2">{student.section}</span>
                </div>
                
                {student.grade && (
                  <div className="d-flex align-items-center mb-2">
                    <strong>Grade:</strong>
                    <span className="badge bg-success ms-2">{student.grade}</span>
                  </div>
                )}
                
                <div className="d-flex align-items-center">
                  <Calendar size={16} className="text-primary me-2" />
                  <strong>Admission Date:</strong>
                  <span className="ms-2">
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* Academic Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Academic Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <div className="text-success mb-2">
                        <Book size={24} />
                      </div>
                      <h6>Current Semester</h6>
                      <h4 className="text-success">Sem {student.semester}</h4>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <div className="text-info mb-2">
                        <Award size={24} />
                      </div>
                      <h6>Section</h6>
                      <h4 className="text-info">{student.section}</h4>
                    </div>
                  </div>
                </div>
              </div>

              {student.grade && (
                <div className="row">
                  <div className="col-12">
                    <div className="card bg-warning text-white">
                      <div className="card-body text-center">
                        <h6>Current Grade</h6>
                        <h3>{student.grade}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Primary Contact</h6>
                  <p>
                    <strong>Email:</strong><br/>
                    <a href={`mailto:${student.email}`} className="text-decoration-none">
                      {student.email}
                    </a>
                  </p>
                  {student.phone && (
                    <p>
                      <strong>Phone:</strong><br/>
                      <a href={`tel:${student.phone}`} className="text-decoration-none">
                        {student.phone}
                      </a>
                    </p>
                  )}
                </div>
                
                <div className="col-md-6">
                  <h6>Academic Details</h6>
                  <p>
                    <strong>Department:</strong><br/>
                    {student.department}
                  </p>
                  <p>
                    <strong>Admission Date:</strong><br/>
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}
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
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/students/${id}/edit`)}
                >
                  Edit Student
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => navigate(`/students/${id}/results`)}
                >
                  View Results
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate(`/students/${id}/attendance`)}
                >
                  View Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;