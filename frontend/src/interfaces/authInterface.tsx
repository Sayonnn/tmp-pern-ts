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
    require2FA?: boolean;
}

export interface DecodedToken extends User {
    exp: number; 
}
  
export interface roleHandlerProps {
    role:string;
}

export interface twoFAProcessResponseProps {
  require2FA: boolean;
  setRequire2FA: (value: boolean) => void;
}

export interface AuthContextProps extends twoFAProcessResponseProps {
  isAuthenticated: boolean;
  accessToken?: string | null;
  initialized: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
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
  redirectIfAuthenticated?: boolean;
}

export interface RecaptchaProps {
  onChange?: (token: string | null) => void;
}

export interface TwoFAResponse {
  status: string | undefined;
  success: boolean;
  message?: string;
  secret?: string;
  qrCodeDataURL?: string;
}
