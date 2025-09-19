// src/routes/config.tsx
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";

import type { RouteConfigArray } from "../../interfaces/authInterface";
import NotFound from "../../pages/defaults/NotFound";

export const routes: RouteConfigArray[] = [
  {
    path: "/",
    element: <Login />,
    role:"admin",
    isProtected:false
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    role:"admin",
    isProtected:true
  },
  {
    path:"*",
    element:<NotFound/>
  }
];
