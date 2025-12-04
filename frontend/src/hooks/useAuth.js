/**
 * useAuth Hook
 * Custom hook for authentication
 */

import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { ROLES } from '../config/constants';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const userData = authService.getUserData();
        setUser(userData);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for unauthorized events from API interceptor
    const handleUnauthorized = () => {
      setUser(null);
      // The ProtectedRoute component will handle navigation
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  // Login function
  const login = useCallback(async (employeeId, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(employeeId, password);
      setUser(data.employee);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // User login function
  const userLogin = useCallback(async (userId, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.userLogin(userId, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userId, password, phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userId, password, phoneNumber);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === ROLES.ADMIN;
  }, [user]);

  // Check if user is cashier
  const isCashier = useCallback(() => {
    return user?.role === ROLES.CASHIER;
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    userLogin,
    register,
    logout,
    hasRole,
    isAdmin,
    isCashier,
    isAuthenticated: !!user
  };
};

export default useAuth;
