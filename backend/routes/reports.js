import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Sales report
router.get('/sales', authenticate, authorize(['Admin', 'Cashier']), reportController.getSalesReport);
// Inventory report
router.get('/inventory', authenticate, authorize(['Admin', 'Cashier']), reportController.getInventoryReport);
// Rental report
router.get('/rentals', authenticate, authorize(['Admin']), reportController.getRentalReport);
// Top selling items
router.get('/top-selling', authenticate, authorize(['Admin']), reportController.getTopSellingItems);
// Employee performance
router.get('/employee-performance', authenticate, authorize(['Admin']), reportController.getEmployeePerformance);

export default router;
