/**
 * Authentication API Service
 * Handles all authentication-related API calls to the new backend
 */

const API_BASE_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
  emailVerified: boolean;
  preferences?: Record<string, any>;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

class AuthApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.loadTokens();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear tokens from memory and localStorage
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Add authorization header if access token exists
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && this.refreshToken && !endpoint.includes('/refresh')) {
        const newAccessToken = await this.handleTokenRefresh();
        if (newAccessToken) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          return fetch(url, { ...options, headers });
        } else {
          // Refresh failed, clear tokens and throw error
          this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Handle token refresh with deduplication
   */
  private async handleTokenRefresh(): Promise<string | null> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new refresh operation
    this.refreshPromise = this.refreshTokens()
      .then((newAccessToken) => {
        this.refreshPromise = null;
        return newAccessToken;
      })
      .catch((error) => {
        this.refreshPromise = null;
        throw error;
      });

    return this.refreshPromise;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshTokens(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      if (data.success && data.accessToken) {
        this.accessToken = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken);

        // Update refresh token if provided
        if (data.refreshToken) {
          this.refreshToken = data.refreshToken;
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();

    if (data.success && data.accessToken && data.refreshToken) {
      this.saveTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    return data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if authenticated
      if (this.accessToken) {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      this.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Try to load from localStorage first
      const cachedUser = localStorage.getItem('user');
      if (cachedUser && this.accessToken) {
        return JSON.parse(cachedUser);
      }

      // If not in cache, fetch from API
      if (!this.accessToken) {
        return null;
      }

      const response = await this.makeRequest('/auth/me');

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    return response.json();
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }

    return response.json();
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest('/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  }

  /**
   * Login with Google OAuth
   */
  getGoogleLoginUrl(): string {
    return `${API_BASE_URL}/auth/google`;
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(code: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'OAuth login failed');
    }

    const data: AuthResponse = await response.json();

    if (data.success && data.accessToken && data.refreshToken) {
      this.saveTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
export default authApiService;
