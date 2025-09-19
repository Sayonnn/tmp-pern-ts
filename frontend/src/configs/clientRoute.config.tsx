// src/routes/config.tsx
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/Dashboard";

import type { RouteConfigArray } from "../interfaces/authInterface";
import NotFound from "../pages/defaults/NotFound";

export const routes: RouteConfigArray[] = [
  {
    path: "/",
    element: <Home />,
    role:"client",
    isProtected:false
  },
  {
    path: "/about",
    element: <About />,
    role:"client",
    isProtected:false
  },
  {
    path: "/login",
    element: <Login />,
    role:"client",
    isProtected:false
  },
  {
    path: "/signup",
    element: <Signup />,
    role:"client",
    isProtected:false
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    role:"client",
    isProtected:false
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    role:"client",
    isProtected:true
  },
  {
    path:"*",
    element:<NotFound/>
  }
];
