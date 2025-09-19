import { Routes, Route } from "react-router-dom";
import { routes } from "../configs/adminRoutes.config";
import ProtectedRoute from "../../middlewares/ProtectedRoute";

function AdminRoutes() {
  return (
    <Routes>
      {routes.map(({ path, element, isProtected, role }, index) => (
        <Route
          key={index}
          path={path}
          element={
            isProtected ? (
              <ProtectedRoute role={role}>{element}</ProtectedRoute>
            ) : (
              element
            )
          }
        />
      ))}
    </Routes>
  );
}

export default AdminRoutes;
