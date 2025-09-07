import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

function ProtectedRoute({ isAuthenticated, children, role }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/upguard-admin" : "/"} />;
  }

  return children;
}

export default ProtectedRoute;
