import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { shouldRedirect } from '@/utils/navigation';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading or if not authenticated
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    const currentPath = location.pathname;
    const redirectPath = shouldRedirect(user.role, currentPath);

    if (redirectPath) {
      console.log(`RoleBasedRedirect: Redirecting from ${currentPath} to ${redirectPath} for role ${user.role}`);
      navigate(redirectPath, { replace: true });
    }

  }, [user, isAuthenticated, isLoading, location.pathname, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-blue-500"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRedirect; 