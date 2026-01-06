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
      return res.status(400).json({ 
        success: false,
        error: 'Employee ID and password required' 
      });
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
    // Set proper status code for authentication errors
    if (error.message === 'Invalid credentials') {
      error.statusCode = 401;
    }
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

export const getAllEmployees = async (req, res, next) => {
  try {
    const authService = getAuthService();
    const employees = await authService.getAllEmployees();
    
    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const { 
      employeeId, 
      firstName, 
      lastName, 
      role, 
      password,
      contactNumber,
      email,
      position,
      department,
      dateOfJoining
    } = req.body;
    
    if (!employeeId || !firstName || !lastName || !role || !password || !contactNumber || !email || !position || !department || !dateOfJoining) {
      return res.status(400).json({ 
        error: 'All fields are required: employeeId, firstName, lastName, contactNumber, email, position, department, dateOfJoining, role, password' 
      });
    }

    const authService = getAuthService();
    const employee = await authService.addEmployee({
      employeeId,
      firstName,
      lastName,
      role,
      password,
      contactNumber,
      email,
      position,
      department,
      dateOfJoining
    });
    
    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { 
      firstName, 
      lastName, 
      role, 
      password,
      contactNumber,
      email,
      position,
      department,
      dateOfJoining
    } = req.body;

    const authService = getAuthService();
    const employee = await authService.updateEmployee(employeeId, {
      firstName,
      lastName,
      role,
      password,
      contactNumber,
      email,
      position,
      department,
      dateOfJoining
    });
    
    res.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const authService = getAuthService();
    await authService.deactivateEmployee(employeeId);
    
    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const pool = getPool();
    const userRepo = new UserRepository(pool);
    const users = await userRepo.findAll();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
