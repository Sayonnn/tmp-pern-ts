import { createContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps } from "../interfaces/authInterface";
import { setStorage, removeStorage, getStorage } from "../utils/storage.handler";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";
import ClientService from "../services/api.service";
import AdminService from "../admin/services/api.service";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [_, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStorage("authToken");
  
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp > now) {
            setAccessToken(token);
            setIsAuthenticated(true);
          
            console.log(decoded)
            setUser(decoded);
          
            await refreshData(decoded.role);
          }else {
            removeStorage("authToken");
            setAccessToken(null);
            setIsAuthenticated(false);
            setUser(null);
            logout();
          }
        }
      } catch (err) {
        console.error("Initialize auth failed:", err);
        logout();
      } finally {
        setInitialized(true);
      }
    };
   
    initializeAuth();
  }, []);
  
/** Login */
const login = async ({ username, password, role }: loginProcessArgsProps) => {
  if (!username || !password) {
    return { status: false, message: "Username or password missing" };
  }

  try {
    let res;

    if (role === "admin") {
      res = await AdminService.auth.login({ username, password });
    } else {
      res = await ClientService.auth.login({ username, password });
    }

    setStorage("authToken", res.accessToken);
    setAccessToken(res.accessToken);
    setIsAuthenticated(true);
    setUser(res.user);

    return { status: true, message: res.message };
  } catch (error: any) {
    return { status: false, message: "Login failed" };
  }
};

/** 🔄 Refresh User Data */
const refreshData = async (role: string) => {
  setLoadingUser(true);
  try {
    let res;

    if (role === "admin") {
      res = await AdminService.auth.refreshInformation();
    } else {
      res = await ClientService.auth.refreshInformation();
    }

    if (res && res.user) {
      console.log("Refreshed user data:", res);
      setUser(res.user);
      return true;
    }
  } catch (err: any) {
    console.warn("Access token invalid or expired:", err);
    logout();
    return false;
  } finally {
    setLoadingUser(false);
  }
};

  /** 🚪 Logout */
  const logout = async () => {
    try {
      if (user?.role === "admin") {
        await AdminService.auth.logout();
      } else {
        await ClientService.auth.logout();
      }
      window.location.reload();
    } catch (err) {
      console.warn("Logout API failed, proceeding to clear local state anyway:", err);
    } finally {
      removeStorage("authToken");
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };


  if (!initialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
