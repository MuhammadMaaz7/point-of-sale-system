/**
 * Coupon Model - Represents discount coupons
 * MySQL implementation
 * Eliminates data smell: Proper coupon management with expiration and usage tracking
 */
class Coupon {
  constructor(data = {}) {
    this.couponCode = data.couponCode ? data.couponCode.trim().toUpperCase() : null;
    this.discountType = data.discountType || 'percentage';
    this.discountValue = data.discountValue ? Math.round(data.discountValue * 100) / 100 : 0;
    this.minPurchaseAmount = data.minPurchaseAmount ? Math.round(data.minPurchaseAmount * 100) / 100 : 0;
    this.maxDiscountAmount = data.maxDiscountAmount ? Math.round(data.maxDiscountAmount * 100) / 100 : null;
    this.expirationDate = data.expirationDate || null;
    this.usageLimit = data.usageLimit || 0;
    this.usageCount = data.usageCount || 0;
    this.isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.couponCode) {
      throw new Error('Coupon code is required');
    }
    if (this.couponCode.length > 20) {
      throw new Error('Coupon code cannot exceed 20 characters');
    }
    if (!['percentage', 'fixed'].includes(this.discountType)) {
      throw new Error('Discount type must be percentage or fixed');
    }
    if (this.discountValue <= 0) {
      throw new Error('Discount value must be greater than 0');
    }
    if (this.discountType === 'percentage' && this.discountValue > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }
    if (this.usageCount < 0) {
      throw new Error('Usage count cannot be negative');
    }
  }

  // Virtual for validity
  get isValid() {
    if (!this.isActive) return false;
    if (this.expirationDate && new Date() > new Date(this.expirationDate)) return false;
    if (this.usageLimit > 0 && this.usageCount >= this.usageLimit) return false;
    return true;
  }

  // Instance method to calculate discount
  calculateDiscount(subtotal) {
    if (!this.isValid) return 0;
    if (subtotal < this.minPurchaseAmount) return 0;
    
    let discount = 0;
    if (this.discountType === 'percentage') {
      discount = Math.round(subtotal * (this.discountValue / 100) * 100) / 100;
    } else {
      discount = this.discountValue;
    }
    
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
    
    return discount;
  }

  // Convert to plain object
  toJSON() {
    return {
      couponCode: this.couponCode,
      discountType: this.discountType,
      discountValue: this.discountValue,
      minPurchaseAmount: this.minPurchaseAmount,
      maxDiscountAmount: this.maxDiscountAmount,
      expirationDate: this.expirationDate,
      usageLimit: this.usageLimit,
      usageCount: this.usageCount,
      isActive: this.isActive,
      isValid: this.isValid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Coupon;
