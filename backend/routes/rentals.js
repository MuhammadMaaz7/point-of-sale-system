import express from 'express';
import * as rentalController from '../controllers/rentalController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all rentals (public for browsing)
router.get('/', rentalController.getRentals);
// Get active rentals (authenticated users)
router.get('/active', authenticate, rentalController.getActiveRentals);
// Get outstanding rentals (must come before /:rentalId)
router.get('/outstanding', authenticate, rentalController.getOutstandingRentals);
// Process rental (authenticated users)
router.post('/process', authenticate, rentalController.processRental);
// Process return (authenticated users)
router.post('/return', authenticate, rentalController.processReturn);
// Get specific rental
router.get('/:rentalId', rentalController.getRental);
// Add new rental (Admin only)
router.post('/', authenticate, authorize(['Admin']), rentalController.addRental);
// Update rental (Admin only)
router.put('/:rentalId', authenticate, authorize(['Admin']), rentalController.updateRental);
// Delete rental (Admin only)
router.delete('/:rentalId', authenticate, authorize(['Admin']), rentalController.deleteRental);

export default router;
