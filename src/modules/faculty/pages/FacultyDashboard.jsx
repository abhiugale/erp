// FacultyDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, BookOpen, FileText, ClipboardCheck, 
  Users, BarChart3, Clock, Award, Download 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingAssignments: 0,
    upcomingExams: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalStudents: 45,
        todayAttendance: 42,
        pendingAssignments: 8,
        upcomingExams: 3
      });

      setRecentActivities([
        { id: 1, type: 'attendance', message: 'Marked attendance for CS101', time: '2 hours ago' },
        { id: 2, type: 'assignment', message: 'Graded Assignment 3', time: '5 hours ago' },
        { id: 3, type: 'exam', message: 'Created Midterm Exam', time: '1 day ago' },
        { id: 4, type: 'quiz', message: 'Quiz 2 completed by students', time: '2 days ago' }
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  // Export Dashboard Data
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Faculty Dashboard Report", 14, 10);
      
      // Stats Table
      doc.autoTable({
        startY: 20,
        head: [['Metric', 'Count']],
        body: [
          ['Total Students', stats.totalStudents],
          ["Today's Attendance", `${stats.todayAttendance}/${stats.totalStudents}`],
          ['Pending Assignments', stats.pendingAssignments],
          ['Upcoming Exams', stats.upcomingExams]
        ],
      });

      // Recent Activities
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Activity', 'Time']],
        body: recentActivities.map(activity => [activity.message, activity.time]),
      });

      doc.save("FacultyDashboard.pdf");
      toast.success("Dashboard exported to PDF successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const exportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Stats sheet
      const statsData = [
        ['Metric', 'Count'],
        ['Total Students', stats.totalStudents],
        ["Today's Attendance", `${stats.todayAttendance}/${stats.totalStudents}`],
        ['Pending Assignments', stats.pendingAssignments],
        ['Upcoming Exams', stats.upcomingExams]
      ];
      const statsWs = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsWs, "Dashboard Stats");

      // Activities sheet
      const activitiesData = [
        ['Activity', 'Time']
      ];
      recentActivities.forEach(activity => {
        activitiesData.push([activity.message, activity.time]);
      });
      const activitiesWs = XLSX.utils.aoa_to_sheet(activitiesData);
      XLSX.utils.book_append_sheet(wb, activitiesWs, "Recent Activities");

      XLSX.writeFile(wb, "FacultyDashboard.xlsx");
      toast.success("Dashboard exported to Excel successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  const modules = [
    {
      title: "Attendance",
      description: "Mark and manage student attendance",
      icon: <ClipboardCheck size={24} />,
      path: "/faculty/main/attendance/mark",
      color: "bg-primary"
    },
    {
      title: "Exams",
      description: "Create and manage examinations",
      icon: <BookOpen size={24} />,
      path: "/faculty/main/exams",
      color: "bg-success"
    },
    {
      title: "Quizzes",
      description: "Create and grade quizzes",
      icon: <Award size={24} />,
      path: "/faculty/main/quizzes",
      color: "bg-warning"
    },
    {
      title: "Assignments",
      description: "Assign and evaluate assignments",
      icon: <FileText size={24} />,
      path: "/faculty/main/assignments",
      color: "bg-info"
    }
  ];

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>Faculty Dashboard</h3>
              <p className="text-muted">Manage your classes, assessments, and student progress</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success d-flex align-items-center"
                onClick={exportExcel}
              >
                <Download size={16} className="me-2" />
                Export Excel
              </button>
              <button 
                className="btn btn-danger d-flex align-items-center"
                onClick={exportPDF}
              >
                <Download size={16} className="me-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Total Students</h6>
                  <h3>{stats.totalStudents}</h3>
                </div>
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Today's Attendance</h6>
                  <h3>{stats.todayAttendance}/{stats.totalStudents}</h3>
                </div>
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Pending Assignments</h6>
                  <h3>{stats.pendingAssignments}</h3>
                </div>
                <FileText size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Upcoming Exams</h6>
                  <h3>{stats.upcomingExams}</h3>
                </div>
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">Teaching Modules</h5>
          <div className="row">
            {modules.map((module, index) => (
              <div key={index} className="col-xl-3 col-md-6 mb-3">
                <div 
                  className="card h-100 shadow-sm hover-shadow"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => navigate(module.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body text-center">
                    <div className={`${module.color} text-white rounded-circle p-3 d-inline-flex mb-3`}>
                      {module.icon}
                    </div>
                    <h5 className="card-title">{module.title}</h5>
                    <p className="card-text text-muted">{module.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <BarChart3 size={20} className="me-2" />
                Recent Activities
              </h5>
            </div>
            <div className="card-body">
              {recentActivities.map(activity => (
                <div key={activity.id} className="d-flex align-items-center mb-3 p-2 border-bottom">
                  <div className={`rounded-circle p-2 me-3 ${
                    activity.type === 'attendance' ? 'bg-primary' :
                    activity.type === 'assignment' ? 'bg-warning' :
                    activity.type === 'exam' ? 'bg-success' : 'bg-info'
                  }`}>
                    {activity.type === 'attendance' && <ClipboardCheck size={16} className="text-white" />}
                    {activity.type === 'assignment' && <FileText size={16} className="text-white" />}
                    {activity.type === 'exam' && <BookOpen size={16} className="text-white" />}
                    {activity.type === 'quiz' && <Award size={16} className="text-white" />}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{activity.message}</div>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => navigate('/faculty/main/attendance/mark')}
              >
                <ClipboardCheck size={16} className="me-2" />
                Mark Today's Attendance
              </button>
              <button 
                className="btn btn-outline-success w-100 mb-2"
                onClick={() => navigate('/faculty/main/assignments')}
              >
                <FileText size={16} className="me-2" />
                Create New Assignment
              </button>
              <button 
                className="btn btn-outline-warning w-100 mb-2"
                onClick={() => navigate('/faculty/main/quizzes')}
              >
                <Award size={16} className="me-2" />
                Create Quiz
              </button>
              <button 
                className="btn btn-outline-info w-100"
                onClick={() => navigate('/faculty/main/exams')}
              >
                <BookOpen size={16} className="me-2" />
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;