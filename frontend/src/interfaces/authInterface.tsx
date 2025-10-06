import type { User } from "./userInterface";

export interface loginProcessArgsProps {
    username: string;
    password: string;
    role?: string; 
}

export interface loginProcessResponseProps {
    field?: string;
    status: boolean;
    message: string;
}

export interface DecodedToken extends User {
    exp: number; 
}
  
export interface roleHandlerProps {
    role:string;
}

export interface AuthContextProps {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  login: (args: loginProcessArgsProps) => Promise<loginProcessResponseProps>;
  logout: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "client";
}

export interface RouteConfigArray {
  path:string;
  element:React.ReactNode;
  role?: "admin" | "client";
  isAuthenticated?: boolean;
  isProtected?: boolean;
}
