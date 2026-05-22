import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Package, Calculator, ShoppingCart, TestTube, Users, BarChart3, LogOut, Menu, X, User } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/stock", icon: Package, label: "Stock" },
    { path: "/dashboard/calculator", icon: Calculator, label: "Calculator" },
    { path: "/dashboard/kasir", icon: ShoppingCart, label: "Kasir" },
    { path: "/dashboard/tester", icon: TestTube, label: "Tester" },
    { path: "/dashboard/customers", icon: Users, label: "Customers" },
    { path: "/dashboard/reports", icon: BarChart3, label: "Reports" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className={`${sidebarOpen ? 'p-6' : 'p-4'} border-b border-gray-200 flex items-center justify-between`}>
          {sidebarOpen ? (
            <>
              <div>
                <h1 className="text-xl text-primary">PerfumeShop</h1>
                <p className="text-sm text-muted-foreground">Management</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="w-full flex justify-center text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'px-0 justify-center'} py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-200 space-y-1">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'px-0 justify-center'} py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
            title={!sidebarOpen ? "Profile" : undefined}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Profile</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'px-0 justify-center'} py-3 rounded-lg w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all`}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg text-gray-900">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">Manage your perfume shop</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@perfumeshop.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
