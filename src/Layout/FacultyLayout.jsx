// src/Layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import FacultySidebar from "../components/FacultySidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { BotMessageSquare } from "lucide-react";
const FacultyLayout = () => {
  const { sidebarCollapsed, showMobileSidebar } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); // Bootstrap md < 992px
    };

    handleResize(); // Run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic margin
  const getMarginLeft = () => {
    if (isMobile) return 0; // full width on mobile
    return sidebarCollapsed ? 80 : 250;
  };

  return (
    <>
      <div className="d-flex">
        <FacultySidebar />

        <div
          className="flex-grow-1"
          style={{
            marginLeft: `${getMarginLeft()}px`,
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Floating AI Assistant Chatbot */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1050,
        }}
      >
        {!isAssistantOpen ? (
          <button
            className="btn btn-primary rounded-circle"
            style={{ width: "60px", height: "60px" }}
            onClick={() => setIsAssistantOpen(true)}
          >
            <BotMessageSquare />
          </button>
        ) : (
          <AIAssistant onClose={() => setIsAssistantOpen(false)} />
        )}
      </div>
    </>
  );
};

export default FacultyLayout;
