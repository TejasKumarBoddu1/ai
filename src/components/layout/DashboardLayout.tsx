
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, Calendar, ChevronLeft, ChevronRight, Cog, CpuIcon, Home, 
  BarChart, LogOut, Users, Bell, Search, Menu, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/hr-dashboard" },
    { name: "Jobs", icon: Briefcase, path: "/hr-dashboard/jobs" },
    { name: "Candidates", icon: Users, path: "/hr-dashboard/candidates" },
    { name: "AI Agents", icon: CpuIcon, path: "/hr-dashboard/ai-agents" },
    { name: "Interviews", icon: Calendar, path: "/hr-dashboard/interviews" },
    { name: "Analytics", icon: BarChart, path: "/hr-dashboard/analytics" },
    { name: "Settings", icon: Cog, path: "/hr-dashboard/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-[#1f2937] text-white z-50 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "fixed lg:relative h-full"
        )}
      >
        {/* Mobile close button */}
        <button 
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 lg:hidden"
          onClick={toggleMobileSidebar}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className={cn(
          "flex items-center p-4 h-16 border-b border-gray-700",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Mahayudh
              </span>
              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-sm font-medium">
                HR
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                M
              </span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 hidden lg:block"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive(item.path)
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700",
                    collapsed ? "px-2" : "px-4"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    if (mobileOpen) setMobileOpen(false);
                  }}
                >
                  <item.icon size={20} />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Button>
              </li>
            ))}
            {/* Add a Profile nav item */}
            <li>
              <Button
                variant={isActive("/hr-dashboard/profile") ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive("/hr-dashboard/profile")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700",
                  collapsed ? "px-2" : "px-4"
                )}
                onClick={() => {
                  navigate("/hr-dashboard/profile");
                  if (mobileOpen) setMobileOpen(false);
                }}
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gray-600">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && <span className="ml-3">Profile</span>}
              </Button>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className={cn(
          "p-4 border-t border-gray-700 flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{user?.name || "HR Manager"}</span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
            )}
          </div>

          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileSidebar}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={24} />
              </button>

              {/* Search */}
              <div className="ml-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Profile Dropdown (for mobile) */}
              <div className="lg:hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#f9fafb] dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
