import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jobnimbus-dashboard-api.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Credential {
  id: string;
  name: string;
  type: 'jobnimbus' | 'openweather' | 'render' | 'github' | 'redis';
  status: 'active' | 'invalid' | 'expired';
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export const adminApiService = {
  // Users endpoints
  async getUsers(params?: {
    status?: string;
    role?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: 'admin' | 'manager' | 'viewer';
    }
  ): Promise<User> {
    const response = await apiClient.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  async approveUser(id: string): Promise<User> {
    const response = await apiClient.post(`/admin/users/${id}/approve`);
    return response.data;
  },

  async suspendUser(id: string): Promise<User> {
    const response = await apiClient.post(`/admin/users/${id}/suspend`);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Credentials endpoints
  async getCredentials(params?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ credentials: Credential[]; total: number }> {
    const response = await apiClient.get('/admin/credentials', { params });
    return response.data;
  },

  async createCredential(data: {
    name: string;
    type: 'jobnimbus' | 'openweather' | 'render' | 'github' | 'redis';
    apiKey: string;
  }): Promise<Credential> {
    const response = await apiClient.post('/admin/credentials', data);
    return response.data;
  },

  async updateCredential(
    id: string,
    data: {
      name?: string;
      apiKey?: string;
    }
  ): Promise<Credential> {
    const response = await apiClient.patch(`/admin/credentials/${id}`, data);
    return response.data;
  },

  async testCredential(
    id: string
  ): Promise<{ valid: boolean; message: string }> {
    const response = await apiClient.post(`/admin/credentials/${id}/test`);
    return response.data;
  },

  async deleteCredential(id: string): Promise<void> {
    await apiClient.delete(`/admin/credentials/${id}`);
  },

  // Audit logs endpoints
  async getAuditLogs(params?: {
    action?: string;
    entityType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const response = await apiClient.get('/admin/audit-logs', { params });
    return response.data;
  },
};

export default adminApiService;
