/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

const authService = {
  /**
   * Employee login
   */
  login: async (employeeId, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      employeeId,
      password
    });
    
    if (response.success && response.data) {
      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.employee));
    }
    
    return response.data;
  },

  /**
   * Customer/User login
   */
  userLogin: async (userId, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.USER_LOGIN, {
      userId,
      password
    });
    
    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * User registration
   */
  register: async (userId, password, phoneNumber) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      userId,
      password,
      phoneNumber
    });
    
    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get stored user data
   */
  getUserData: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Get user role
   */
  getUserRole: () => {
    const userData = authService.getUserData();
    return userData?.role || null;
  },

  /**
   * Get all employees (Admin only)
   */
  getAllEmployees: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.EMPLOYEES);
    return response.data;
  },

  /**
   * Add new employee (Admin only)
   */
  addEmployee: async (employeeData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.EMPLOYEES, employeeData);
    return response.data;
  },

  /**
   * Update employee (Admin only)
   */
  updateEmployee: async (employeeId, employeeData) => {
    const response = await api.put(API_ENDPOINTS.AUTH.EMPLOYEE_BY_ID(employeeId), employeeData);
    return response.data;
  },

  /**
   * Deactivate employee (Admin only)
   */
  deactivateEmployee: async (employeeId) => {
    const response = await api.delete(API_ENDPOINTS.AUTH.EMPLOYEE_BY_ID(employeeId));
    return response.data;
  }
};

export default authService;
