import { Routes, Route } from "react-router-dom";
import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import NotFound from "../pages/NotFound";
import { useAuthContext } from "../providers/AuthProvider";

function AdminRoutes() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* When user goes to /speedmate-admin, show Login */}
      <Route path="" element={<Login />} />

      {/* Protected Dashboard (full path: /speedmate-admin/dashboard) */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} role="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for unmatched client routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
