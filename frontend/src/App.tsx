import { Routes, Route } from "react-router-dom";
import Home from "./clients/pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./clients/pages/auths/Login.tsx";
import Signup from "./clients/pages/auths/Signup.tsx";
import About from "./clients/pages/About.tsx";
// admin pages
import AdminLogin from "./admin/pages/Login.tsx";
import Dashboard from "./admin/pages/Dashboard.tsx";
// others
import { useAuth } from "./hooks/useAuth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() { 
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public/Clients */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin */}
      <Route path="/upguard-admin" element={<AdminLogin />} />
      <Route
        path="/upguard-admin/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
