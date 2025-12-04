/**
 * useToast Hook
 * Custom hook for toast notifications
 */

import { useState, useCallback } from 'react';
import { TOAST_TYPES, UI } from '../config/constants';
import { generateId } from '../utils/helpers';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add toast
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = UI.TOAST_DURATION) => {
    const id = generateId();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Success toast
  const success = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.SUCCESS, duration);
  }, [addToast]);

  // Error toast
  const error = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.ERROR, duration);
  }, [addToast]);

  // Warning toast
  const warning = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.WARNING, duration);
  }, [addToast]);

  // Info toast
  const info = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.INFO, duration);
  }, [addToast]);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  };
};

export default useToast;
