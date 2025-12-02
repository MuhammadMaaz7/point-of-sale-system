/**
 * Auth Controller - Handles authentication requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import AuthService from '../services/AuthService.js';
import EmployeeRepository from '../repositories/EmployeeRepository.js';
import UserRepository from '../repositories/UserRepository.js';

const getAuthService = () => {
  const pool = getPool();
  const employeeRepo = new EmployeeRepository(pool);
  const userRepo = new UserRepository(pool);
  return new AuthService(employeeRepo, userRepo);
};

export const login = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    
    if (!employeeId || !password) {
      return res.status(400).json({ error: 'Employee ID and password required' });
    }

    const authService = getAuthService();
    const { employee, token } = await authService.login(employeeId, password);
    
    res.json({
      success: true,
      data: {
        employee,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const data = req.userType === 'user' ? req.user : req.employee;
    res.json({
      success: true,
      data,
      userType: req.userType
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { userId, password, phoneNumber } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password required' });
    }

    const authService = getAuthService();
    const { user, token } = await authService.registerUser(userId, password, phoneNumber);
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password required' });
    }

    const authService = getAuthService();
    const { user, token } = await authService.loginUser(userId, password);
    
    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
