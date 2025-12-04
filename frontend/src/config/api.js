/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER_LOGIN: '/auth/user/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    EMPLOYEES: '/auth/employees',
    EMPLOYEE_BY_ID: (id) => `/auth/employees/${id}`
  },
  
  // Sales
  SALES: {
    BASE: '/sales',
    BY_ID: (id) => `/sales/${id}`,
    RETURNS: '/sales/returns'
  },
  
  // Inventory
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id) => `/inventory/${id}`
  },
  
  // Rentals
  RENTALS: {
    BASE: '/rentals',
    BY_ID: (id) => `/rentals/${id}`,
    PROCESS: '/rentals/process',
    RETURN: '/rentals/return',
    OUTSTANDING: '/rentals/outstanding',
    HISTORY: (userId) => `/rentals/history/${userId}`
  },
  
  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    RENTALS: '/reports/rentals'
  },
  
  // Health
  HEALTH: '/health'
};

export default API_BASE_URL;
