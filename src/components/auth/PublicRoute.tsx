import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute Component
 *
 * For public pages like login and register.
 * Redirects to dashboard if user is already authenticated.
 *
 * @param children - The component to render (login or register page)
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated - show public page
  return <>{children}</>;
};

export default PublicRoute;
