import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/items', authenticate, inventoryController.getItems);
router.post('/items', authenticate, authorize(['Admin']), inventoryController.addItem);
router.put('/items/:itemId', authenticate, authorize(['Admin']), inventoryController.updateItemQuantity);
router.get('/low-stock', authenticate, authorize(['Admin']), inventoryController.getLowStock);

export default router;
