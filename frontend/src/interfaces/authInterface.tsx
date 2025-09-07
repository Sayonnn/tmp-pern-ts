import type { User } from "./userInterface";

export interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
    role:string;
}
  
export interface loginProcessArgsProps {
    username: string;
    password: string;
    role: string;
}

export interface loginProcessResponseProps {
    field?: string;
    status: boolean;
    message: string;
}

export interface DecodedToken {
    id: string;
    email: string;
    role: string;
    exp: number; 
    username: string;
    image?: File | Blob;
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
