import express from 'express';
import * as couponController from '../controllers/couponController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Active coupons - accessible by all authenticated users (for cashiers)
router.get('/active', authenticate, couponController.getActiveCoupons);

// All other coupon routes require Admin access
router.get('/', authenticate, authorize(['Admin']), couponController.getCoupons);
router.get('/:code', authenticate, authorize(['Admin']), couponController.getCoupon);
router.post('/', authenticate, authorize(['Admin']), couponController.createCoupon);
router.put('/:code', authenticate, authorize(['Admin']), couponController.updateCoupon);
router.delete('/:code', authenticate, authorize(['Admin']), couponController.deleteCoupon);

export default router;
