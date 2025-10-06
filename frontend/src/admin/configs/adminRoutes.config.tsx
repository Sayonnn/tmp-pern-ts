// src/routes/config.tsx
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import ResetPassword from "../pages/auth/ResetPassword";
// import Setup2FA from "../pages/auth/Setup2FA";
// import Verify2FA from "../pages/auth/Verify2FA";
// import GoogleCallback from "../pages/auth/GoogleCallback";
import NotFound from "../../pages/defaults/NotFound";

import type { RouteConfigArray } from "../../interfaces/authInterface";

/* ==========================================
 * Route Configuration (Admin)
 * ========================================== */
export const routes: RouteConfigArray[] = [
  /* ============================
   * Auth Routes
   * ============================ */
  {
    path: "/",
    element: <Login />,
    role: "admin",
    isProtected: false,
  },
  // {
  //   path: "/forgot-password",
  //   element: <ForgotPassword />,
  //   role: "admin",
  //   isProtected: false,
  // },
  // {
  //   path: "/reset-password/:token",
  //   element: <ResetPassword />,
  //   role: "admin",
  //   isProtected: false,
  // },

  /* ============================
   * Two-Factor Authentication (2FA)
   * ============================ */
  // {
  //   path: "/setup-2fa",
  //   element: <Setup2FA />,
  //   role: "admin",
  //   isProtected: true, // must be logged in
  // },
  // {
  //   path: "/verify-2fa",
  //   element: <Verify2FA />,
  //   role: "admin",
  //   isProtected: true, // verify after setup
  // },

  /* ============================
   * Google OAuth Callback
   * ============================ */
  // {
  //   path: "/auth/google/callback",
  //   element: <GoogleCallback />,
  //   role: "admin",
  //   isProtected: false,
  // },

  /* ============================
   * Dashboard
   * ============================ */
  {
    path: "/dashboard",
    element: <Dashboard />,
    role: "admin",
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
