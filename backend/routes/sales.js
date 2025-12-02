import express from 'express';
import * as saleController from '../controllers/saleController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create sale
router.post('/', authenticate, saleController.createSale);
// Get all sales
router.get('/', authenticate, saleController.getSales);
// Get specific sale
router.get('/:saleId', authenticate, saleController.getSale);
// Process return
router.post('/returns', authenticate, saleController.processReturn);

export default router;
