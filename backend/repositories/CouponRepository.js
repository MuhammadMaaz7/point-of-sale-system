/**
 * CouponRepository - Data access layer for coupons
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Coupon from '../models/Coupon.js';

class CouponRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM coupons ORDER BY createdAt DESC';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Coupon(row));
  }

  async findById(couponCode) {
    return this.findByCode(couponCode);
  }

  async findByCode(couponCode) {
    const query = 'SELECT * FROM coupons WHERE couponCode = ?';
    const [rows] = await this.pool.execute(query, [couponCode.toUpperCase()]);
    return rows.length > 0 ? new Coupon(rows[0]) : null;
  }

  async findActive() {
    const query = `SELECT * FROM coupons 
                   WHERE isActive = 1 
                   AND (expirationDate IS NULL OR expirationDate >= CURDATE())
                   AND (usageLimit = 0 OR usageCount < usageLimit)
                   ORDER BY createdAt DESC`;
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Coupon(row));
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
    // Convert empty strings to null for optional fields
    const maxDiscount = couponData.maxDiscountAmount === '' || couponData.maxDiscountAmount === null 
      ? null 
      : couponData.maxDiscountAmount;
    const expDate = couponData.expirationDate === '' || couponData.expirationDate === null 
      ? null 
      : couponData.expirationDate.split('T')[0]; // Extract date only
    
    const query = `UPDATE coupons SET discountType = ?, discountValue = ?, 
                   minPurchaseAmount = ?, maxDiscountAmount = ?, expirationDate = ?, 
                   usageLimit = ?, isActive = ?, updatedAt = NOW() WHERE couponCode = ?`;
    await this.pool.execute(query, [
      couponData.discountType,
      couponData.discountValue,
      couponData.minPurchaseAmount,
      maxDiscount,
      expDate,
      couponData.usageLimit,
      couponData.isActive !== undefined ? couponData.isActive : true,
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
    const query = 'DELETE FROM coupons WHERE couponCode = ?';
    await this.pool.execute(query, [couponCode]);
    return true;
  }
}

export default CouponRepository;
