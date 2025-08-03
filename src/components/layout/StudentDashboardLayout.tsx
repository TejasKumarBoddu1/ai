
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Briefcase, Calendar, ChevronLeft, ChevronRight, Cog, Home, 
  BarChart, LogOut, Users, Bell, Search, Menu, X, FileText,
  Linkedin, GitCompare, Route, Mic, RotateCw, Shield, Code,
  Rocket, Activity, Brain, Award, Lock, HelpCircle, PhoneCall,
  Mail
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/hooks/useApplications";

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const StudentDashboardLayout = ({ children }: StudentDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationCount } = useApplications();

  console.log('StudentDashboardLayout rendering, current path:', location.pathname);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const navSections: NavSection[] = [
    {
      items: [
        { name: "Dashboard", icon: Home, path: "/student-home" },
        { name: "Apply for Jobs", icon: FileText, path: "/apply" },
        { name: "My Applications", icon: Mail, path: "/my-applications", badge: applicationCount || 0 },
        { name: "My Analytics", icon: BarChart, path: "/analytics" },
      ]
    },
    {
      title: "CV TOOLS",
      items: [
        { name: "Resume Builder", icon: FileText, path: "/builder" },
        { name: "ATS Scanner", icon: Search, path: "/ats-scanner" },
        { name: "LinkedIn Optimizer", icon: Linkedin, path: "/linkedin-optimizer" },
        { name: "Resume Compare", icon: GitCompare, path: "/resume-compare" },
      ]
    },
    {
      title: "CAREER GUIDE",
      items: [
        { name: "Career Path Simulator", icon: Route, path: "/career-path-simulator" },
        { name: "Interview Coach", icon: Mic, path: "/interview-coach" },
        { name: "Job Board", icon: Briefcase, path: "/job-board" },
        { name: "AI Job Switch Planner", icon: RotateCw, path: "/ai-job-switch-planner" },
        { name: "AI Shadow Career Simulator", icon: Users, path: "/ai-shadow-career-simulator" },
        { name: "AI Layoff Readiness Toolkit", icon: Shield, path: "/ai-layoff-readiness-toolkit" },
      ]
    },
    {
      title: "MAHAYUDH LEARN",
      items: [
        { name: "AI Coding Coach", icon: Code, path: "/ai-coding-coach" },
        { name: "AI Builder", icon: Rocket, path: "/ai-builder" },
        { name: "Skill Gap Analysis", icon: Activity, path: "/skill-gap-analysis" },
        { name: "Mindprint Assessment", icon: Brain, path: "/mindprint-assessment" },
      ]
    },
    {
      title: "BLOCKCHAIN SECURITY",
      items: [
        { name: "MahayudhCert", icon: Award, path: "/certification-center" },
        { name: "Blockchain Vault", icon: Lock, path: "/blockchain-vault" },
      ]
    },
    {
      items: [
        { name: "Help Center", icon: HelpCircle, path: "/help" },
        { name: "Settings", icon: Cog, path: "/settings" },
        { name: "ContactConnect", icon: PhoneCall, path: "/contact" },
      ]
    },
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
                Student
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

        {/* Nav Items with ScrollArea - making scroll invisible */}
        <ScrollArea className="flex-grow py-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          <div className="px-3 space-y-0.5">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title || `section-${sectionIndex}`}>
                {section.title && (
                  <div className={cn("pt-3 pb-1", collapsed ? "hidden" : "")}>
                    <button
                      onClick={() => toggleSection(section.title || '')}
                      className="flex items-center justify-between w-full px-2 group"
                    >
                      <span className="text-xs font-semibold text-gray-400">
                        {section.title}
                      </span>
                      <ChevronRight
                        size={14}
                        className={cn(
                          "text-gray-400 transition-transform duration-200 ease-in-out group-hover:text-gray-300",
                          activeSection === section.title ? "transform rotate-90" : ""
                        )}
                      />
                    </button>
                  </div>
                )}
                
                {(!section.title || activeSection === section.title) && section.items.map((item) => (
                  <div 
                    key={item.name} 
                    className={cn(
                      "transition-all duration-200 ease-in-out",
                      section.title && activeSection !== section.title ? "h-0 opacity-0 overflow-hidden" : "opacity-100"
                    )}
                  >
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start relative",
                        isActive(item.path)
                          ? "bg-blue-600/20 text-blue-500 border-l-2 border-blue-500"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50",
                        collapsed ? "px-2" : "px-4"
                      )}
                      onClick={() => handleNavigate(item.path)}
                    >
                      <item.icon size={20} />
                      {!collapsed && (
                        <>
                          <span className="ml-3">{item.name}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge 
                              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white" 
                              variant="secondary"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && item.badge > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 text-white"
                          variant="secondary"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </div>
                ))}

                {/* Separator after main nav and before first section, and after the last item */}
                {(sectionIndex === 0 || sectionIndex === navSections.length - 2) && (
                  <div className="py-2 px-2">
                    <div className="h-px bg-gray-700" />
                  </div>
                )}
              </div>
            ))}

            {/* Logout button at the end */}
            <div>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start mt-2",
                  "text-gray-300 hover:text-white hover:bg-gray-700",
                  collapsed ? "px-2" : "px-4"
                )}
                onClick={handleLogout}
              >
                <LogOut size={20} />
                {!collapsed && <span className="ml-3">Logout</span>}
              </Button>
            </div>

            {/* Profile at the bottom outside the sections */}
            <div className="mt-4">
              <Button
                variant={isActive("/profile") ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive("/profile")
                    ? "bg-blue-600/20 text-blue-500 border-l-2 border-blue-500"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50",
                  collapsed ? "px-2" : "px-4"
                )}
                onClick={() => handleNavigate("/profile")}
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gray-600">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && <span className="ml-3">Profile</span>}
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* User Profile (in collapsed state move to the bottom) */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{user?.name || "Student"}</span>
                <span className="text-xs text-gray-400">User</span>
              </div>
            </div>
          </div>
        )}
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

export default StudentDashboardLayout;
