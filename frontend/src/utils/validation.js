/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION } from '../config/constants';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_PATTERN.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  return VALIDATION.PHONE_PATTERN.test(phone);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validate credit card using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || cardNumber.length !== VALIDATION.CREDIT_CARD_LENGTH) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate number range
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate integer
 */
export const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

/**
 * Form validation helper
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }

    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email format';
      return;
    }

    if (fieldRules.phone && value && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || 'Invalid phone number';
      return;
    }

    if (fieldRules.password && value && !isValidPassword(value)) {
      errors[field] = fieldRules.passwordMessage || `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      return;
    }

    if (fieldRules.min !== undefined && value && parseFloat(value) < fieldRules.min) {
      errors[field] = fieldRules.minMessage || `Must be at least ${fieldRules.min}`;
      return;
    }

    if (fieldRules.max !== undefined && value && parseFloat(value) > fieldRules.max) {
      errors[field] = fieldRules.maxMessage || `Must be at most ${fieldRules.max}`;
      return;
    }

    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidCreditCard,
  isRequired,
  isInRange,
  isPositiveNumber,
  isInteger,
  validateForm
};
