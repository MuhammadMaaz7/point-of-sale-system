import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all items (accessible to all authenticated users)
router.get('/', inventoryController.getItems);
// Get specific item
router.get('/:itemId', inventoryController.getItem);
// Add new item (Admin only)
router.post('/', authenticate, authorize(['Admin']), inventoryController.addItem);
// Update item (Admin only)
router.put('/:itemId', authenticate, authorize(['Admin']), inventoryController.updateItem);
// Delete item (Admin only)
router.delete('/:itemId', authenticate, authorize(['Admin']), inventoryController.deleteItem);
// Get low stock items (Admin only)
router.get('/low-stock', authenticate, authorize(['Admin']), inventoryController.getLowStock);

export default router;
