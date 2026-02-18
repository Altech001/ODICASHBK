import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { useAuthStore } from '../store/useAuthStore';

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
  return config;
});

// Interceptor for handling token refresh or unauthorized errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    const originalRequest = error.config;

    // List of routes that should not trigger a token refresh
    const noRefreshRoutes = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/verify-email', '/auth/forgot-password', '/auth/reset-password'];
    const isNoRefreshRoute = noRefreshRoutes.some(route => originalRequest.url?.includes(route));

    // If error is 401, we haven't tried to refresh yet, and it's not a public auth route
    if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshRoute) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        useAuthStore.getState().logout();
        
        // Only redirect if we are not already on the login page to avoid loops
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // For any other 401 that wasn't caught by the refresh logic (e.g. refresh itself failed or no token)
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
