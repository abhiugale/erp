import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./modules/admin/pages/Dashboard";
import StudentList from "./modules/admin/pages/StudentList";
import FacultyList from "./modules/admin/pages/FacultyList";
import ExamList from "./modules/admin/pages/ExamList";
import LibraryDashboard from "./modules/admin/pages/LibraryDashboard";
import AIAssistant from "./modules/admin/pages/AIAssistant";
import PredictPerformance from "./modules/admin/pages/PredictPerformance";
import ReportDashboard from "./modules/admin/pages/ReportDashboard";
import StudentDetails from "./modules/admin/pages/StudentDetails";
import FacultyDetails from "./modules/admin/pages/FacultyDetails";
import AdminLogin from "./modules/admin/pages/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import Finance from "./modules/admin/pages/Finance";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="main" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
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
    </Routes>
  );
};

export default App;
