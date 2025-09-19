// src/routes/ClientRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import { routes } from "../configs/clientRoute.config";

function ClientRoutes() {
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

export default ClientRoutes;
