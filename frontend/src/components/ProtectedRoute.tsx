import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

function ProtectedRoute({isAuthenticated,children}:ProtectedRouteProps){
  if(!isAuthenticated){
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;