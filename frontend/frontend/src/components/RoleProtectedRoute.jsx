import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth.service";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "TECHNICIEN") {
      return <Navigate to="/technicien/interventions" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}