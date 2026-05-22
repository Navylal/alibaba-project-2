import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Calculator from "./pages/Calculator";
import Kasir from "./pages/Kasir";
import Tester from "./pages/Tester";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "stock", Component: Stock },
      { path: "calculator", Component: Calculator },
      { path: "kasir", Component: Kasir },
      { path: "tester", Component: Tester },
      { path: "customers", Component: Customers },
      { path: "reports", Component: Reports },
      { path: "profile", Component: Profile },
    ],
  },
]);
