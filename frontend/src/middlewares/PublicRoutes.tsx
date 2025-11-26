// PublicRoute.tsx
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuth";
import useAppContext from "../hooks/useApp";

interface PublicRouteProps {
  children: React.ReactNode;
  role?: string;
}

const PublicRoute = ({ children, role }: PublicRouteProps) => {
  const { isAuthenticated, user, initialized } = useAuthContext();
  const { configs } = useAppContext();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const dashboardPath = role === "admin" 
      ? `/${configs.appName}-admin/dashboard` 
      : "/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  // User is not authenticated, show the public page
  return <>{children}</>;
};

export default PublicRoute;