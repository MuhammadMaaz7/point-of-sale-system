import express from 'express';
import * as rentalController from '../controllers/rentalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, rentalController.getRentals);
router.post('/', authenticate, rentalController.rentItem);
router.put('/:userRentalId/return', authenticate, rentalController.returnItem);

export default router;
