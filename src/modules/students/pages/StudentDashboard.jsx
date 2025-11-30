// StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  FileText,
  ClipboardCheck,
  ArrowLeft,
  BarChart3,
  Clock,
  Award,
  User,
  Mail,
  Phone,
  GraduationCap,
  Bookmark,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    attendancePercentage: 0,
    pendingAssignments: 0,
    upcomingExams: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get student ID from localStorage (set during login)
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      toast.error("Student Id not found. Please login again.");
      navigate("/");
      return;
    }
    fetchDashboardData();
    fetchStudentProfile();
  }, [userId, navigate]);

  // API Base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch Dashboard Statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/students/dashboard/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const dashboardData = await statsResponse.json();
        setStats({
          totalCourses: dashboardData.totalCourses || 0,
          attendancePercentage: dashboardData.attendancePercentage || 0,
          pendingAssignments: dashboardData.pendingAssignments || 0,
          upcomingExams: dashboardData.upcomingExams || 0,
        });
      } else {
        // Use mock data if API fails
        setStats({
          totalCourses: 6,
          attendancePercentage: 85,
          pendingAssignments: 3,
          upcomingExams: 2,
        });
      }

      // Fetch recent activities
      const activitiesResponse = await fetch(`${API_BASE_URL}/students/${userId}/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData);
      } else {
        // Use mock activities if API fails
        setRecentActivities(getMockActivities());
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      
      // Fallback to mock data
      setStats({
        totalCourses: 6,
        attendancePercentage: 85,
        pendingAssignments: 3,
        upcomingExams: 2,
      });
      setRecentActivities(getMockActivities());
    } finally {
      setLoading(false);
    }
  };

  // Fetch Student Profile - Uses your existing getStudentById method
  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const studentData = await response.json();
        
        // Map the response to match your Student entity fields
        setStudentProfile({
          name: studentData.name || "N/A",
          studentPrn: studentData.studentPrn || "N/A",
          department: studentData.department || "N/A",
          semester: studentData.semester || "N/A",
          section: studentData.section || "N/A",
          grade: studentData.grade || "N/A",
          email: studentData.email || "N/A",
          phone: studentData.phone || "N/A",
          admissionDate: studentData.admissionDate || "2022-08-20",
        });
        
        console.log("✅ Student profile loaded successfully:", studentData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      toast.error("Failed to load student profile");
      
      // Fallback to mock profile data
      setStudentProfile({
        name: "Aditya Pawase",
        studentPrn: "PRN124",
        department: "Computer Applications",
        semester: 3,
        section: "A",
        grade: "SY",
        email: "aditya@college.com",
        phone: "+1-555-0124",
        admissionDate: "2025-11-02",
      });
    }
  };

  // Mock activities fallback
  const getMockActivities = () => {
    return [
      {
        id: 1,
        type: "assignment",
        message: "Assignment 3 submitted",
        time: "2 hours ago",
        status: "submitted",
      },
      {
        id: 2,
        type: "quiz",
        message: "Quiz 1 completed - Score: 18/20",
        time: "1 day ago",
        status: "completed",
      },
      {
        id: 3,
        type: "exam",
        message: "Midterm exam scheduled",
        time: "2 days ago",
        status: "upcoming",
      },
      {
        id: 4,
        type: "attendance",
        message: "Attendance marked for CS101",
        time: "3 days ago",
        status: "present",
      },
    ];
  };

  const handleBack = () => {
    navigate(-1);
  };

  const modules = [
    {
      title: "Attendance",
      description: "View your attendance records",
      icon: <ClipboardCheck size={24} />,
      path: "/student/main/attendance",
      color: "bg-primary",
    },
    {
      title: "Exams",
      description: "Check exam schedule and results",
      icon: <BookOpen size={24} />,
      path: "/student/main/exams",
      color: "bg-success",
    },
    {
      title: "Quizzes",
      description: "Take and view quizzes",
      icon: <Award size={24} />,
      path: "/student/main/quizzes",
      color: "bg-warning",
    },
    {
      title: "Assignments",
      description: "Submit and track assignments",
      icon: <FileText size={24} />,
      path: "/student/main/assignments",
      color: "bg-info",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "attendance":
        return <ClipboardCheck size={16} className="text-white" />;
      case "assignment":
        return <FileText size={16} className="text-white" />;
      case "exam":
        return <BookOpen size={16} className="text-white" />;
      case "quiz":
        return <Award size={16} className="text-white" />;
      default:
        return <BarChart3 size={16} className="text-white" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "attendance":
        return "bg-primary";
      case "assignment":
        return "bg-warning";
      case "exam":
        return "bg-success";
      case "quiz":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { class: "bg-success", text: "Submitted" },
      completed: { class: "bg-info", text: "Completed" },
      upcoming: { class: "bg-warning", text: "Upcoming" },
      present: { class: "bg-success", text: "Present" },
      absent: { class: "bg-danger", text: "Absent" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };
    return <span className={`badge ${config.class} ms-2`}>{config.text}</span>;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      {/* Header with Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm me-3 d-flex align-items-center"
                onClick={handleBack}
              >
                <ArrowLeft size={16} className="me-1" />
                Back
              </button>
              <div>
                <h3 className="fw-bold text-dark mb-0">Student Dashboard</h3>
                <p className="text-muted mb-0">
                  Welcome back{studentProfile ? `, ${studentProfile.name}` : ""}
                  ! Track your academic progress.
                </p>
                {studentProfile && (
                  <small className="text-muted">
                    PRN: {studentProfile.studentPrn} | {studentProfile.department} - Semester {studentProfile.semester}
                  </small>
                )}
              </div>
            </div>
            <div>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">
                    Enrolled Courses
                  </h6>
                  <h2 className="fw-bold mb-0">{stats.totalCourses}</h2>
                  <small className="text-white-50">Current semester</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <Bookmark size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Attendance</h6>
                  <h2 className="fw-bold mb-0">
                    {stats.attendancePercentage}%
                  </h2>
                  <small className="text-white-50">Overall percentage</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <ClipboardCheck size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">
                    Pending Assignments
                  </h6>
                  <h2 className="fw-bold mb-0">{stats.pendingAssignments}</h2>
                  <small className="text-white-50">Need to submit</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <FileText size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">
                    Upcoming Exams
                  </h6>
                  <h2 className="fw-bold mb-0">{stats.upcomingExams}</h2>
                  <small className="text-white-50">Scheduled</small>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <Clock size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Modules and Activities */}
        <div className="col-lg-8">
          {/* Learning Modules */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">Learning Modules</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {modules.map((module, index) => (
                  <div key={index} className="col-xl-6 col-md-6 mb-3">
                    <div
                      className="card h-100 border-0 shadow-sm-hover"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid #e9ecef",
                      }}
                      onClick={() => navigate(module.path)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div
                            className={`${module.color} text-white rounded-circle p-3 me-3`}
                          >
                            {module.icon}
                          </div>
                          <div>
                            <h6 className="card-title mb-1 fw-semibold">
                              {module.title}
                            </h6>
                            <p className="card-text text-muted small mb-0">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">
                <BarChart3 size={20} className="me-2" />
                Recent Activities
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id || activity.activityId}
                    className="d-flex align-items-center mb-3 p-3 border-bottom"
                  >
                    <div
                      className={`rounded-circle p-2 me-3 ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold d-flex align-items-center">
                        {activity.message}
                        {activity.status && getStatusBadge(activity.status)}
                      </div>
                      <small className="text-muted">
                        {activity.time || formatDate(activity.timestamp)}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <BarChart3 size={48} className="text-muted mb-2" />
                  <p className="text-muted">No recent activities found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Profile and Quick Links */}
        <div className="col-lg-4">
          {/* Student Profile */}
          {studentProfile && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header border-1">
                <h5 className="mb-0 fw-semibold">Student Profile</h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="bg-primary rounded-circle d-inline-flex p-3 mb-2">
                    <User size={24} className="text-white" />
                  </div>
                  <h6 className="fw-bold mb-1">{studentProfile.name}</h6>
                  <p className="text-muted small mb-2">
                    {studentProfile.department} - Semester{" "}
                    {studentProfile.semester}
                  </p>
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex align-items-center mb-2">
                    <Mail size={16} className="text-muted me-2" />
                    <small className="text-muted">{studentProfile.email}</small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Phone size={16} className="text-muted me-2" />
                    <small className="text-muted">{studentProfile.phone}</small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BookOpen size={16} className="text-muted me-2" />
                    <small className="text-muted">
                      PRN: {studentProfile.studentPrn}
                    </small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <GraduationCap size={16} className="text-muted me-2" />
                    <small className="text-muted">
                      Grade: {studentProfile.grade}
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <Calendar size={16} className="text-muted me-2" />
                    <small className="text-muted">
                      Joined {formatDate(studentProfile.admissionDate)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">Quick Links</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center"
                onClick={() => navigate("/student/main/assignments")}
              >
                <FileText size={16} className="me-2" />
                View Assignments
              </button>
              <button
                className="btn btn-outline-success w-100 mb-2 d-flex align-items-center justify-content-center"
                onClick={() => navigate("/student/main/quizzes")}
              >
                <Award size={16} className="me-2" />
                Take Quiz
              </button>
              <button
                className="btn btn-outline-warning w-100 mb-2 d-flex align-items-center justify-content-center"
                onClick={() => navigate("/student/main/exams")}
              >
                <BookOpen size={16} className="me-2" />
                Exam Schedule
              </button>
              <button
                className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                onClick={() => navigate("/student/main/attendance")}
              >
                <ClipboardCheck size={16} className="me-2" />
                Check Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;