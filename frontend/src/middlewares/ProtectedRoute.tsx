// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuth";
import useAppContext from "../hooks/useApp";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthContext();
  const { configs } = useAppContext();

  /** Not logged in → redirect to login */
  if (!isAuthenticated) {
    const loginPath = role === "admin" ? `/${configs.appName}-admin` : "/login";
    return <Navigate to={loginPath} replace />;
  }

  /** Role mismatch → redirect to correct dashboard */
  if (role && user?.role !== role) {
    const correctPath = user?.role === "admin" ? `/${configs.appName}-admin` : "/";
    return <Navigate to={correctPath} replace />;
  }

  /** Authorized → render children */
  return <>{children}</>;
};

export default ProtectedRoute;
