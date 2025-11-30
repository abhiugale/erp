// StudentAttendance.jsx
import { useState, useEffect } from "react";
import { Calendar, TrendingUp, CheckCircle,   ArrowLeft, XCircle, Clock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        setAttendanceData([
          {
            courseCode: "CS101",
            courseName: "Introduction to Programming",
            totalClasses: 45,
            attended: 38,
            percentage: 84.4,
            records: [
              { date: "2024-01-15", status: "present" },
              { date: "2024-01-16", status: "present" },
              { date: "2024-01-18", status: "absent" },
              { date: "2024-01-20", status: "present" },
              { date: "2024-01-22", status: "late" },
              { date: "2024-01-25", status: "present" },
            ]
          },
          {
            courseCode: "MATH202",
            courseName: "Calculus II",
            totalClasses: 40,
            attended: 35,
            percentage: 87.5,
            records: [
              { date: "2024-01-15", status: "present" },
              { date: "2024-01-16", status: "present" },
              { date: "2024-01-18", status: "present" },
              { date: "2024-01-20", status: "absent" },
              { date: "2024-01-22", status: "present" },
            ]
          },
          {
            courseCode: "PHY101",
            courseName: "Physics Fundamentals",
            totalClasses: 42,
            attended: 36,
            percentage: 85.7,
            records: [
              { date: "2024-01-15", status: "present" },
              { date: "2024-01-16", status: "absent" },
              { date: "2024-01-18", status: "present" },
              { date: "2024-01-20", status: "present" },
              { date: "2024-01-22", status: "present" },
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to load attendance data");
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} className="text-success" />;
      case 'absent':
        return <XCircle size={16} className="text-danger" />;
      case 'late':
        return <Clock size={16} className="text-warning" />;
      default:
        return <CheckCircle size={16} className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { class: 'bg-success', text: 'Present' },
      absent: { class: 'bg-danger', text: 'Absent' },
      late: { class: 'bg-warning', text: 'Late' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-danger';
  };

  const filteredCourses = selectedCourse === "all" 
    ? attendanceData 
    : attendanceData.filter(course => course.courseCode === selectedCourse);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading Attendance Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/*Back Button */}
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
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold text-dark">Attendance Records</h3>
              <p className="text-muted mb-0">Track your class attendance and performance</p>
            </div>
            <div className="d-flex gap-2">
              <select 
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {attendanceData.map(course => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">
                <TrendingUp size={20} className="me-2" />
                Overall Attendance Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {attendanceData.map((course, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card border-1 ">
                      <div className="card-body">
                        <h6 className="card-title">{course.courseCode}</h6>
                        <p className="text-muted small mb-2">{course.courseName}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`fw-bold ${getPercentageColor(course.percentage)}`}>
                            {course.percentage}%
                          </span>
                          <small className="text-muted">
                            {course.attended}/{course.totalClasses} classes
                          </small>
                        </div>
                        <div className="progress mt-2" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${course.percentage >= 85 ? 'bg-success' : course.percentage >= 75 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${course.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">
                <Calendar size={20} className="me-2" />
                Detailed Attendance Records
              </h5>
            </div>
            <div className="card-body">
              {filteredCourses.map((course, courseIndex) => (
                <div key={courseIndex} className="mb-4">
                  <h6 className="fw-semibold mb-3">
                    {course.courseCode} - {course.courseName}
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.records.map((record, recordIndex) => (
                          <tr key={recordIndex}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getStatusIcon(record.status)}
                                <span className="ms-2">{getStatusBadge(record.status)}</span>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {record.status === 'present' ? 'Class attended' :
                                 record.status === 'absent' ? 'Class missed' :
                                 'Arrived late to class'}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-4">
                  <Calendar size={48} className="text-muted mb-2" />
                  <p className="text-muted">No attendance records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;