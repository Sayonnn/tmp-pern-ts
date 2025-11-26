import { createContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps } from "../interfaces/authInterface";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";
import ClientService from "../services/api.service"; 
import AdminService from "../admin/services/api.service";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
 
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  // 2FA  
  const [require2FA, setRequire2FA] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [_, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    /**
     * NOTE: 3 steps here to persist data and avoid saving in local storage
     * 1. each reload request information the token then distribute to the app
     * 2. each request add the token to the header
     * 3. after login get 2fa completed proof from backend
     * 4. use that to determine whether the user completed the 2fa or not
     */
    const initializeAuth = async () => {
      try {
        /** retrieve access token */
        const token = await retrieveAccessToken();
        // console.log("Access token: ", token);
  
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);

          const now = Date.now() / 1000;
          if (decoded.exp > now) {
            setAccessToken(token); 
            setIsAuthenticated(true);
            setUser(decoded);

            await refreshData(decoded.role);
          }else {
            setAccessToken(null);
            setIsAuthenticated(false);
            setUser(null);
            logout();
          }
        }
      } catch (err) {
        console.error("Initialize auth failed:", err);
      } finally {
        setInitialized(true);
      }
    }; 

    initializeAuth();
  }, []);

/** get token */
const retrieveAccessToken = async () => {
  try {
    const res = await ClientService.auth.getAccessToken();
    if(!res){
      console.error("Failed to retrieve access token. ",);
    }
    return res.accessToken;
  } catch (error : any) {
    console.error("Something went wrong: ", error.message);
  }
}
  
/** Login */
const login = async ({ username, password, role }: loginProcessArgsProps) => {
  if (!username || !password) return { status: false, message: "Username or password missing" };

  try {
    let res;

    if (role === "admin") {
      res = await AdminService.auth.login({ username, password });
    } else {
      res = await ClientService.auth.login({ username, password });
    }

    setAccessToken(res.accessToken);
    setIsAuthenticated(true);
    setUser(res.user);
    setRequire2FA(res.user.twofa_enabled);

    return { status: true, message: res.message, require2FA: res.user.twofa_enabled };
  } catch (error: any) {
    return { status: false, message: "Login failed" };
  }
};

/** Refresh User Data */
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
      // console.log("Refreshed user data:", res);
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
    } catch (err) {
      console.warn("Logout API failed, proceeding to clear local state anyway:", err);
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
      setRequire2FA(false); 
    }
  };


  if (!initialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, user, login, logout, require2FA, setRequire2FA, setIsAuthenticated, initialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };