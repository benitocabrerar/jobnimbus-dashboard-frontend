import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApiService, User, LoginCredentials, RegisterData } from '../services/authApiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      if (authApiService.isAuthenticated()) {
        const currentUser = await authApiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token invalid, clear everything
          await authApiService.logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authApiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApiService.login(credentials);

      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData) => {
    try {
      const response = await authApiService.register(data);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      // Note: User might need email verification before they can login
      // Don't automatically log them in
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authApiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  /**
   * Refresh current user data
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authApiService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
