import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
