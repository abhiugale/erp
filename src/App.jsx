import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
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
import StudentDashboard from "./modules/students/pages/StudentDashboard";
import Profile from "./components/Profile";
import FacultyDashboard from "./modules/faculty/pages/FacultyDashboard";
import FacultyAttendance from "./modules/faculty/pages/FacultyAttendace";
import FacultyExams from "./modules/faculty/pages/FacultyExams";
import FacultyQuizzes from "./modules/faculty/pages/FacultyQuizzes";
import FacultyAssignments from "./modules/faculty/pages/FacultyAssignments";
import FacultyLayout from "./Layout/FacultyLayout";
import StudentLayout from "./Layout/StudentLayout";
import StudentAttendance from "./modules/students/pages/StudentAttendance";
import StudentAssignments from "./modules/students/pages/StudentAssignments";
import StudentQuizzes from "./modules/students/pages/StudentQuizzes";
import StudentExams from "./modules/students/pages/StudentExams";

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
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admindashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<Profile />} />  
        <Route path="students" element={<StudentList />} />
        <Route path="students/:id/details" element={<StudentDetails />} />
        <Route path="faculties" element={<FacultyList />} />
        <Route path="faculties/:id/details" element={<FacultyDetails />} />
        <Route path="exams" element={<ExamList />} />
        <Route path="library" element={<LibraryDashboard />} />
        <Route path="finance" element={<Finance />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="predict" element={<PredictPerformance />} />
        <Route path="reports" element={<ReportDashboard />} />
      </Route>
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<AuthLogin />} />

      <Route
        path="/faculty/main"
        element={
          <ProtectedRoute requiredRole="FACULTY">
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="facultydashboard" element={<FacultyDashboard />} />
        <Route path="attendance/mark" element={<FacultyAttendance />} />
        <Route path="exams" element={<FacultyExams />} />
        <Route path="quizzes" element={<FacultyQuizzes />} />
        <Route path="assignments" element={<FacultyAssignments />} />
      </Route>

      <Route
        path="/student/main"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="studentdashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="exams" element={<StudentExams />} />
      </Route>
      <Route path="/unauthorized" element={<AuthLogin />} />

      {/* Student routes protected by STUDENT role */}

    </Routes>
  );
};

export default App;
