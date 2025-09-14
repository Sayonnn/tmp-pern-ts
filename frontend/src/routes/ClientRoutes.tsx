import { Routes,Route } from "react-router-dom";
import About from "../pages/About";
import Signup from "../pages/auths/Signup";
import Home from "../pages/Home";
import ForgotPassword from "../pages/auths/ForgotPassword";
import Login from "../pages/auths/Login";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/defaults/NotFound";
import useAuthContext from "../hooks/useAuth";

function ClientRoutes() {
  const {isAuthenticated} = useAuthContext();

  return (
    <Routes>
      <Route path="" element={<Home />}/>
      <Route path="about" element={<About />} />
      <Route path="">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword/>} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} role="client">
            <Dashboard />
          </ProtectedRoute>
        }
      />

        {/* Catch-all for unmatched admin routes */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default ClientRoutes