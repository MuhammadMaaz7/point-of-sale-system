/**
 * CouponRepository - Data access layer for coupons
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Coupon from '../models/Coupon.js';

class CouponRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM coupons WHERE isActive = 1';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Coupon(row));
  }

  async findById(couponCode) {
    return this.findByCode(couponCode);
  }

  async findByCode(couponCode) {
    const query = 'SELECT * FROM coupons WHERE couponCode = ? AND isActive = 1';
    const [rows] = await this.pool.execute(query, [couponCode.toUpperCase()]);
    return rows.length > 0 ? new Coupon(rows[0]) : null;
  }

  async create(couponData) {
    const coupon = new Coupon(couponData);
    coupon.validate();
    
    const query = `INSERT INTO coupons (couponCode, discountType, discountValue, 
                   minPurchaseAmount, maxDiscountAmount, expirationDate, usageLimit) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await this.pool.execute(query, [
      coupon.couponCode,
      coupon.discountType,
      coupon.discountValue,
      coupon.minPurchaseAmount,
      coupon.maxDiscountAmount,
      coupon.expirationDate,
      coupon.usageLimit
    ]);
    
    return this.findByCode(coupon.couponCode);
  }

  async update(couponCode, couponData) {
    const query = `UPDATE coupons SET discountType = ?, discountValue = ?, 
                   minPurchaseAmount = ?, maxDiscountAmount = ?, expirationDate = ?, 
                   usageLimit = ?, updatedAt = NOW() WHERE couponCode = ?`;
    await this.pool.execute(query, [
      couponData.discountType,
      couponData.discountValue,
      couponData.minPurchaseAmount,
      couponData.maxDiscountAmount,
      couponData.expirationDate,
      couponData.usageLimit,
      couponCode
    ]);
    return this.findByCode(couponCode);
  }

  async incrementUsage(couponCode) {
    const query = `UPDATE coupons SET usageCount = usageCount + 1, 
                   updatedAt = NOW() WHERE couponCode = ?`;
    await this.pool.execute(query, [couponCode]);
  }

  async delete(couponCode) {
    const query = 'UPDATE coupons SET isActive = 0, updatedAt = NOW() WHERE couponCode = ?';
    await this.pool.execute(query, [couponCode]);
    return true;
  }
}

export default CouponRepository;
