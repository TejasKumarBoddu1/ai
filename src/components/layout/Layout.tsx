
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";
import PublicNavbar from "./PublicNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);

  console.log('Layout rendering, current path:', location.pathname);

  // For auth pages, don't wrap in MainLayout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Always allow the children to render properly without interference
  // Remove the MainLayout type checking that was causing issues
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
