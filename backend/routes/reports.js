import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/top-selling', authenticate, authorize(['Admin']), reportController.getTopSellingItems);
router.get('/employee-performance', authenticate, authorize(['Admin']), reportController.getEmployeePerformance);

export default router;
