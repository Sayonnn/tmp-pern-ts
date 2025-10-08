// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuth";
import useAppContext from "../hooks/useApp";
import type { ProtectedRouteProps } from "../interfaces/authInterface";
import { useEffect, useState } from "react";
import ClientService from "../services/api.service";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, initialized } = useAuthContext();
  const [is2FADone, setIs2FADone] = useState<boolean | null>(null); // null = loading
  const [checking2FA, setChecking2FA] = useState<boolean>(true);
  
  const { configs } = useAppContext();

  useEffect(() => {
    console.log("🔐 ProtectedRoute - Starting 2FA check");
    console.log("📊 Auth State:", { 
      isAuthenticated, 
      initialized, 
      userExists: !!user,
      username: user?.username,
      twofa_enabled: user?.twofa_enabled,
      role: user?.role
    });

    const get2FAProof = async () => {
      try {
        console.log("🔍 Fetching 2FA proof from backend...");
        const res = await ClientService.auth.get2FAProof();
        
        if (!res) {
          console.error("❌ Failed to retrieve 2FA proof - response is null/undefined");
          return { is2FACompleted: false };
        }
        
        console.log("✅ 2FA Proof Response:", res);
        return res;
      } catch (error: any) {
        console.error("❌ Error retrieving 2FA proof:", error.message);
        return { is2FACompleted: false };
      }
    };

    const init = async () => {
      try {
        setChecking2FA(true);
        const res = await get2FAProof();
        const completed = res?.is2FACompleted || false;
        
        console.log("🎯 2FA Check Result:", completed);
        setIs2FADone(completed);
        
        if (user?.twofa_enabled && !completed) {
          console.warn("⚠️ SECURITY ALERT: User has 2FA enabled but hasn't completed verification!");
          console.warn("   User will be redirected to login");
        } else if (user?.twofa_enabled && completed) {
          console.log("✅ 2FA verification confirmed - access granted");
        } else {
          console.log("ℹ️ 2FA not enabled for this user");
        }
      } catch (error) {
        console.error("❌ Failed to initialize 2FA check:", error);
        setIs2FADone(false);
      } finally {
        setChecking2FA(false);
      }
    };

    if (initialized && isAuthenticated && user) {
      init();
    } else {
      console.log("⏸️ Skipping 2FA check - conditions not met");
      setChecking2FA(false);
    }
  }, [initialized, isAuthenticated, user]);

  // Wait for auth to initialize
  if (!initialized) {
    console.log("⏳ Waiting for auth to initialize...");
    return <div>Loading authentication...</div>;
  }

  // Wait for 2FA check to complete
  if (checking2FA || is2FADone === null) {
    console.log("⏳ Checking 2FA status...");
    return <div>Verifying security...</div>;
  }

  console.log("🚦 Route Protection Check:");
  console.log("   - isAuthenticated:", isAuthenticated);
  console.log("   - user exists:", !!user);
  console.log("   - twofa_enabled:", user?.twofa_enabled);
  console.log("   - is2FADone:", is2FADone);

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    console.log("🚫 Access denied: User not authenticated");
    const loginPath = role === "admin" ? `/${configs.appName}-admin` : "/login";
    return <Navigate to={loginPath} replace />;
  }

  // Role mismatch → redirect to correct dashboard
  if (role && user?.role !== role) {
    console.log("🚫 Access denied: Role mismatch");
    console.log("   Expected:", role, "| Got:", user?.role);
    const correctPath = user?.role === "admin" ? `/${configs.appName}-admin` : "/";
    return <Navigate to={correctPath} replace />;
  }

  // SECURITY CHECK: If user has 2FA enabled but hasn't completed verification
  if (user?.twofa_enabled && !is2FADone) {
    console.error("🚨 SECURITY BLOCK: 2FA required but not completed!");
    console.error("   Redirecting to login...");
    const loginPath = role === "admin" ? `/${configs.appName}-admin` : "/login";
    return <Navigate to={loginPath} replace />;
  }

  // All checks passed
  console.log("✅ Access granted - rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;