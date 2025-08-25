import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import StudentList from "./modules/admin/pages/StudentList";
import FacultyList from "./modules/admin/pages/FacultyList";
import ExamList from "./modules/admin/pages/ExamList";
import LibraryDashboard from "./modules/admin/pages/LibraryDashboard";
import AIAssistant from "./modules/admin/pages/AIAssistant";
import PredictPerformance from "./modules/admin/pages/PredictPerformance";
import ReportDashboard from "./modules/admin/pages/ReportDashboard";
import StudentDetails from "./modules/admin/pages/StudentDetails";
import FacultyDetails from "./modules/admin/pages/FacultyDetails";
import Finance from "./modules/admin/pages/Finance";
import AuthLogin from "./components/AuthLogin";
import Unauthorized from "./components/Unauthorized";

const App = () => {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<AuthLogin />} />

      {/* Admin routes protected by role */}
      <Route
        path="/admin/main"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admindashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id/details" element={<StudentDetails />} />
        <Route path="faculty" element={<FacultyList />} />
        <Route path="faculty/:id/details" element={<FacultyDetails />} />
        <Route path="exams" element={<ExamList />} />
        <Route path="library" element={<LibraryDashboard />} />
        <Route path="finance" element={<Finance />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="predict" element={<PredictPerformance />} />
        <Route path="reports" element={<ReportDashboard />} />
      </Route>

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default App;
