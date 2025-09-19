import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import useAppContext from "./hooks/useApp";
import NotFound from "./pages/defaults/NotFound";

function App() {
  const { configs } = useAppContext();
  return (
    <Routes>
        {/* add toast here for notifications */}
        
        {/* Public/Client-facing */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path={`/${configs.appName}-admin/*`} element={<AdminRoutes />} />

        {/* Global fallback */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
