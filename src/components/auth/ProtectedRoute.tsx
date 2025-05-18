import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Helper functions for role checking
const hasRole = (user: any, role: string): boolean => {
  if (!user?.roles) return false;
  
  // Case-insensitive check
  return user.roles.some((r: string) => 
    r.toLowerCase() === role.toLowerCase() || 
    r.toLowerCase().includes(role.toLowerCase())
  );
};

const hasAnyRole = (user: any, roles: string[]): boolean => {
  if (!roles || roles.length === 0) return true;
  return roles.some(role => hasRole(user, role));
};

const isAdmin = (user: any): boolean => {
  return hasRole(user, 'admin');
};

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  

  // Still loading, show nothing or a loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the current location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If there are required roles and user doesn't have any of them (except admins, who can access everything)
  if (requiredRoles.length > 0 && !isAdmin(user) && !hasAnyRole(user, requiredRoles)) {
    // For customer role, redirect to shop page
    if (hasRole(user, 'customer')) {
      return <Navigate to="/shop" replace />;
    }
    
    // For others, use dashboard or home
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 