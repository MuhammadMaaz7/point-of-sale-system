import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Employee authentication
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

// User (customer) authentication
router.post('/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

// Employee management (Admin only)
router.get('/employees', authenticate, requireAdmin, authController.getAllEmployees);
router.post('/employees', authenticate, requireAdmin, authController.addEmployee);
router.put('/employees/:employeeId', authenticate, requireAdmin, authController.updateEmployee);
router.delete('/employees/:employeeId', authenticate, requireAdmin, authController.deactivateEmployee);

export default router;
