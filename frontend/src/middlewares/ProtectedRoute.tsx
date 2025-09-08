// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthContext();

  // Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/speedmate-admin" : "/"} />;
  }

  // Logged in but role does not match → redirect
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/speedmate-admin" : "/"} />;
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
