import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuth";
import useAppContext from "../hooks/useApp";
import type { ProtectedRouteProps } from "../interfaces/authInterface";
import { useEffect, useState } from "react";
import ClientService from "../services/api.service";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, initialized } = useAuthContext();
  const [is2FADone, setIs2FADone] = useState<boolean | null>(null);
  const [checking2FA, setChecking2FA] = useState<boolean>(true);
  
  const { configs } = useAppContext();

  useEffect(() => {
    const get2FAProof = async () => {
      try {
        const res = await ClientService.auth.get2FAProof();
        
        if (!res) {
          return { is2FACompleted: false };
        }
        
        return res;
      } catch (error: any) {
        return { is2FACompleted: false };
      }
    };

    const init = async () => {
      try {
        setChecking2FA(true);
        const res = await get2FAProof();
        const completed = res?.is2FACompleted === true;
        
        setIs2FADone(completed);
      } catch (error) {
        setIs2FADone(false);
      } finally {
        setChecking2FA(false);
      }
    };

    if (initialized && isAuthenticated && user) {
      init();
    } else {
      setChecking2FA(false);
    }
  }, [initialized, isAuthenticated, user]);

  if (!initialized) {
    return <div>Loading authentication...</div>;
  }

  if (checking2FA || is2FADone === null) {
    return <div>Verifying security...</div>;
  }

  if (!isAuthenticated) {
    const loginPath = role === "admin" ? `/${configs.appName}-admin` : "/login";
    return <Navigate to={loginPath} replace />;
  }

  if (role && user?.role !== role) {
    const correctPath = user?.role === "admin" ? `/${configs.appName}-admin` : "/";
    return <Navigate to={correctPath} replace />;
  }

  if (user?.twofa_enabled && !is2FADone) {
    const loginPath = role === "admin" ? `/${configs.appName}-admin` : "/login";
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;