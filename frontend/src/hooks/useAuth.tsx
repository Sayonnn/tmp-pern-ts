import { useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken") 
  );

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "password123") {
      localStorage.setItem("authToken", "fake-jwt-token");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
