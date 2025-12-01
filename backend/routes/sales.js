import express from 'express';
import * as saleController from '../controllers/saleController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, saleController.createSale);
router.get('/', authenticate, saleController.getSales);

export default router;
