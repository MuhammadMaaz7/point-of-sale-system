/**
 * Authentication and Authorization Middleware
 * MySQL implementation
 */
import jwt from 'jsonwebtoken';
import { getPool } from '../config/db.js';
import EmployeeRepository from '../repositories/EmployeeRepository.js';
import UserRepository from '../repositories/UserRepository.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const pool = getPool();
    
    // Check if it's a user (customer) token
    if (decoded.type === 'user') {
      const userRepo = new UserRepository(pool);
      const user = await userRepo.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }
      
      req.user = user;
      req.userType = 'user';
    } else {
      // Employee token
      const employeeRepo = new EmployeeRepository(pool);
      const employee = await employeeRepo.findById(decoded.employeeId);
      
      if (!employee || !employee.isActive) {
        return res.status(401).json({ error: 'Invalid authentication' });
      }
      
      req.employee = employee;
      req.userType = 'employee';
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.employee) {
      return res.status(403).json({ error: 'Employee access required' });
    }

    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export { authenticate, authorize };
