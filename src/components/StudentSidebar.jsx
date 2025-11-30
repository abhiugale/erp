import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ THIS IS MISSING
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  Library,
  BadgePercent,
  Brain,
  Bot,
  BarChart2,
  BadgeIndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentSidebar = () => {
  const {
    darkMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    showMobileSidebar,
    setShowMobileSidebar,
  } = useTheme();

  return (
    <>
      {/* Overlay background on mobile */}
      <div
        className={`d-lg-none position-fixed top-0 start-0 w-100 h-100 ${
          darkMode ? "bg-dark text-white" : "bg-light text-dark"
        } ${showMobileSidebar ? "" : "d-none"}`}
        onClick={() => setShowMobileSidebar(false)}
        style={{ zIndex: 998 }}
      />

      {/* Sidebar itself */}
      <div
        className={`${
          darkMode ? "bg-dark text-white" : "bg-light text-dark"
        } p-3 position-fixed top-0 start-0 h-100 ${
          sidebarCollapsed ? "collapsed-sidebar" : ""
        } ${showMobileSidebar ? "d-block" : "d-none"} d-lg-block`}
        style={{
          width: sidebarCollapsed ? "80px" : "250px",
          transition: "width 0.3s ease",
          zIndex: 999,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!sidebarCollapsed && (
            <h5>
              <img src="/public/assests/images/brainbox_logo.png" alt="BrainBox Logo"   style={{ width: '100px', height: 'auto' }}
 />
            </h5>
          )}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/student/main/studentdashboard"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <LayoutDashboard size={20} className="me-2" />
              {!sidebarCollapsed && "Dashboard"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/student/main/attendance"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <Users size={20} className="me-2" />
              {!sidebarCollapsed && "Attendance"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/student/main/exams"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <BadgePercent size={20} className="me-2" />
              {!sidebarCollapsed && "Exams"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/student/main/quizzes"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <BookOpenCheck size={20} className="me-2" />
              {!sidebarCollapsed && "Quizzes"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/student/main/assignments"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <Library size={20} className="me-2" />
              {!sidebarCollapsed && "Assignments"}
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink
              to="/admin/main/finance"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <BadgeIndianRupee size={20} className="me-2" />
              {!sidebarCollapsed && "Finance"}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/main/ai-assistant"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <Brain size={20} className="me-2" />
              {!sidebarCollapsed && "AI Assistance"}
            </NavLink>
          </li>
          */}
          <li className="nav-item">
            <NavLink
              to="/admin/main/predict"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <Bot size={20} className="me-2" />
              {!sidebarCollapsed && "AI Predictor"}
            </NavLink>
          </li> 
          <li className="nav-item">
            <NavLink
              to="/admin/main/reports"
              className={`nav-link ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
              }`}
            >
              <BarChart2 size={20} className="me-2" />
              {!sidebarCollapsed && "Reports"}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default StudentSidebar;
