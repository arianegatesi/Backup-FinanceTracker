import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";

const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
import PrivateRoute from './routes/PrivateRoute'; // Import the PrivateRoute component
import AdminDashboard from "./pages/AdminDashboard";

import Invoices from "./pages/Invoices";
import Employees from "./pages/Employees";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard", // 
    element: <DashboardPage />,
  },
  {
    path: "/admin-dashboard", // 
    element: <AdminDashboard />,
  },
  {
    path: "/invoice", // 
    element: <Invoices />,
  },
  {
    path: "/employee", // 
    element: <Employees />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
