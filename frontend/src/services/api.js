/**
 * API Service
 * Axios instance with interceptors for authentication and error handling
 */

import axios from 'axios';
import API_BASE_URL from '../config/api';
import { STORAGE_KEYS, HTTP_STATUS } from '../config/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return data directly for successful responses
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          error.message = data?.error || data?.message || 'Invalid credentials';
          // Clear auth data but don't redirect here - let components handle it
          // This prevents full page reloads
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            // Dispatch a custom event that AuthContext can listen to
            window.dispatchEvent(new Event('unauthorized'));
          }
          break;
          
        case HTTP_STATUS.FORBIDDEN:
          // User doesn't have permission
          error.message = 'You do not have permission to perform this action';
          break;
          
        case HTTP_STATUS.NOT_FOUND:
          error.message = data?.error || data?.message || 'Resource not found';
          break;
          
        case HTTP_STATUS.BAD_REQUEST:
          error.message = data?.error || data?.message || 'Invalid request';
          break;
          
        case HTTP_STATUS.SERVER_ERROR:
          error.message = data?.error || data?.message || 'Server error. Please try again later';
          break;
          
        default:
          error.message = data?.error || data?.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your connection';
    } else {
      error.message = 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default api;
