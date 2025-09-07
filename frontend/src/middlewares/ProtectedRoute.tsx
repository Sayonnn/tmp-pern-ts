// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthContext();

  // Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/upguard-admin" : "/"} />;
  }

  // Logged in but role does not match → redirect
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/upguard-admin" : "/"} />;
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
