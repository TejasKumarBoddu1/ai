
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode | ((props: { user: any }) => React.ReactNode);
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-modern-blue-500"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to new login page
  if (!isAuthenticated) {
    return <Navigate to="/new-login" state={{ from: location }} replace />;
  }
  
  // If roles are specified, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If authenticated and authorized, render the protected content
  // If children is a function, call it with the user
  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
