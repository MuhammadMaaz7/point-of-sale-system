/**
 * Auth Controller - Handles authentication requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import AuthService from '../services/AuthService.js';
import EmployeeRepository from '../repositories/EmployeeRepository.js';

const getAuthService = () => {
  const pool = getPool();
  const employeeRepo = new EmployeeRepository(pool);
  return new AuthService(employeeRepo);
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
    res.json({
      success: true,
      data: req.employee
    });
  } catch (error) {
    next(error);
  }
};
