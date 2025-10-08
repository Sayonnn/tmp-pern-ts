// src/routes/config.tsx
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import ResetPassword from "../pages/auth/ResetPassword";
// import Setup2FA from "../pages/auth/Setup2FA";
// import Verify2FA from "../pages/auth/Verify2FA";
// import GoogleCallback from "../pages/auth/GoogleCallback";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/defaults/NotFound";

import type { RouteConfigArray } from "../interfaces/authInterface";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import TwoFA from "../pages/auth/TwoFA";

/* ==========================================
 * Route Configuration
 * ========================================== */
export const routes: RouteConfigArray[] = [
  /* ============================
   * Public Pages
   * ============================ */
  {
    path: "/",
    element: <Home />,
    role: "client",
    isProtected: false,
  },
  {
    path: "/about",
    element: <About />,
    role: "client",
    isProtected: false,
  },

  /* ============================
   * Authentication Routes
   * ============================ */
  {
    path: "/login",
    element: <Login />,
    role: "client",
    isProtected: false,
  },
  {
    path: "/signup",
    element: <Signup />,
    role: "client",
    isProtected: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    role: "client",
    isProtected: false,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    role: "client",
    isProtected: false,
  },

  /* ============================
   * Two-Factor Authentication (2FA)
   * ============================ */
  {
    path: "/2fa",
    element: <TwoFA />,
    role: "client",
    isProtected: true,
  },

  /* ============================
   * Google OAuth Callback
   * ============================ */
  // {
  //   path: "/auth/google/callback",
  //   element: <GoogleCallback />,
  //   role: "client",
  //   isProtected: false,
  // },

  /* ============================
   * Dashboard (Protected)
   * ============================ */
  {
    path: "/dashboard",
    element: <Dashboard />,
    role: "client",
    isProtected: true,
  },

  /* ============================
   * 404 Not Found
   * ============================ */
  {
    path: "*",
    element: <NotFound />,
  },
];
