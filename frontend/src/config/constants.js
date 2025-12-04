/**
 * Application Constants
 * Centralized constants for the application
 */

// User Roles
export const ROLES = {
  ADMIN: 'Admin',
  CASHIER: 'Cashier'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pos_auth_token',
  USER_DATA: 'pos_user_data',
  THEME: 'pos_theme',
  CART: 'pos_cart'
};

// API Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss'
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_PATTERN: /^\d{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CREDIT_CARD_LENGTH: 16
};

// Business Rules
export const BUSINESS_RULES = {
  RENTAL_PERIOD_DAYS: 14,
  LATE_FEE_RATE: 0.10,
  TAX_RATE: 0.06,
  LOW_STOCK_THRESHOLD: 10,
  CRITICAL_STOCK_THRESHOLD: 5
};

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 200
};

export default {
  ROLES,
  STORAGE_KEYS,
  HTTP_STATUS,
  TOAST_TYPES,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION,
  BUSINESS_RULES,
  UI
};
