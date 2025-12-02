import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Employee authentication
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

// User (customer) authentication
router.post('/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

export default router;
