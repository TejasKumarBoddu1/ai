import { UserRole } from '@/types/auth';

// Navigation utility for consistent role-based routing
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'organization':
      return '/hr-dashboard';
    case 'admin':
      return '/everyone';
    case 'student':
    default:
      return '/student-home';
  }
};

export const isStudentRoute = (path: string): boolean => {
  const studentRoutes = [
    '/student-home',
    '/job-search',
    '/apply',
    '/my-applications',
    '/analytics',
    '/certification-center',
    '/certificate'
  ];
  return studentRoutes.some(route => path.startsWith(route));
};

export const isOrganizationRoute = (path: string): boolean => {
  const organizationRoutes = [
    '/hr-dashboard',
    '/hr-dashboard/jobs',
    '/hr-dashboard/candidates',
    '/hr-dashboard/ai-agents',
    '/hr-dashboard/interviews',
    '/hr-dashboard/analytics',
    '/hr-dashboard/settings',
    '/hr-dashboard/profile'
  ];
  return organizationRoutes.some(route => path.startsWith(route));
};

export const isPublicRoute = (path: string): boolean => {
  const publicRoutes = [
    '/login',
    '/register',
    '/new-login',
    '/forgot-password',
    '/reset-password',
    '/verify-cert',
    '/verify-document',
    '/unauthorized',
    '/about',
    '/contact',
    '/everyone'
  ];
  return publicRoutes.includes(path);
};

export const shouldRedirect = (userRole: UserRole, currentPath: string): string | null => {
  // Don't redirect on public routes
  if (isPublicRoute(currentPath)) {
    return null;
  }

  // Redirect root to appropriate dashboard
  if (currentPath === '/') {
    return getDashboardPath(userRole);
  }

  // Redirect students away from organization routes
  if (userRole === 'student' && isOrganizationRoute(currentPath)) {
    return '/student-home';
  }

  // Redirect organizations away from student routes
  if (userRole === 'organization' && isStudentRoute(currentPath)) {
    return '/hr-dashboard';
  }

  // Redirect admins to everyone page if they're on role-specific routes
  if (userRole === 'admin' && (isStudentRoute(currentPath) || isOrganizationRoute(currentPath))) {
    return '/everyone';
  }

  return null;
}; 