/**
 * Coupon Controller - Handles coupon management requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import CouponRepository from '../repositories/CouponRepository.js';

export const getCoupons = async (req, res, next) => {
  try {
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    const coupons = await couponRepo.findAll();
    
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    const coupon = await couponRepo.findByCode(code);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    const coupon = await couponRepo.create(req.body);
    
    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    const coupon = await couponRepo.update(code, req.body);
    
    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    await couponRepo.delete(code);
    
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveCoupons = async (req, res, next) => {
  try {
    const pool = getPool();
    const couponRepo = new CouponRepository(pool);
    const coupons = await couponRepo.findActive();
    
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};
