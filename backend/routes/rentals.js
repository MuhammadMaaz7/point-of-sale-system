import express from 'express';
import * as rentalController from '../controllers/rentalController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all rentals (public for browsing)
router.get('/', rentalController.getRentals);
// Get specific rental
router.get('/:rentalId', rentalController.getRental);
// Add new rental (Admin only)
router.post('/', authenticate, authorize(['Admin']), rentalController.addRental);
// Update rental (Admin only)
router.put('/:rentalId', authenticate, authorize(['Admin']), rentalController.updateRental);
// Delete rental (Admin only)
router.delete('/:rentalId', authenticate, authorize(['Admin']), rentalController.deleteRental);
// Rent item (authenticated users)
router.post('/rent', authenticate, rentalController.rentItem);
// Return item (authenticated users)
router.put('/:userRentalId/return', authenticate, rentalController.returnItem);

export default router;
