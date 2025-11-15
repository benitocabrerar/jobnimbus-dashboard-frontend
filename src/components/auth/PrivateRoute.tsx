import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'manager' | 'viewer'>;
}

/**
 * PrivateRoute Component
 *
 * Protects routes that require authentication.
 * Optionally restricts access based on user roles.
 *
 * @param children - The component to render if authenticated
 * @param requiredRoles - Optional array of roles that are allowed to access this route
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = user && requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      // User doesn't have required role - redirect to dashboard with error
      return <Navigate to="/" state={{ error: 'Insufficient permissions' }} replace />;
    }
  }

  // User is authenticated and has required role (if any) - render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
