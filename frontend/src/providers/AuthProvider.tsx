// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps, loginProcessResponseProps } from "../interfaces/authInterface";
import { postDatas } from "../services/api.service";
import { setStorage, removeStorage, getStorage } from "../utils/storage.handler";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStorage("authToken");
      const storedUser = getStorage("authUser");

      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp > now) {
            // Token still valid
            setAccessToken(token);
            setIsAuthenticated(true);

            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              const newUser = {
                email: decoded.email,
                role: decoded.role,
                username: decoded.username,
              };
              setUser(newUser);
              setStorage("authUser", JSON.stringify(newUser));
            }
          } else {
            // Token expired → refresh
            const response = await postDatas({ url: "/auth/refresh-access-token" });
            setStorage("authToken", response.accessToken);
            setStorage("authUser", JSON.stringify(response.user));
            setAccessToken(response.accessToken);
            setIsAuthenticated(true);
            setUser(response.user);
          }
        } catch {
          logout();
        }
      }

      setInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async ({ username, password, role }: loginProcessArgsProps) => {
    if (!username || !password)
      return { status: false, message: "Username or password missing" } as loginProcessResponseProps;

    try {
      const response = await postDatas({
        url: role === "admin" ? "/speedmate-admin/auth/login" : "/auth/login",
        data: { username, password },
      });

      setStorage("authToken", response.accessToken);
      setStorage("authUser", JSON.stringify(response.user));
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      setUser(response.user);

      return { status: true, message: "Login successful" };
    } catch (error: any) {
      return { status: false, message: error.message || "Login failed" };
    }
  };

  const logout = () => {
    removeStorage("authToken");
    removeStorage("authUser");
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
