/**
 * CouponService - Business logic for coupon management
 * Refactored from Java PointOfSale.coupon() logic
 * MySQL implementation
 * Eliminates: Duplicate File I/O, Hard-coded Paths, Magic Numbers
 */
class CouponService {
  constructor(couponRepo) {
    this.couponRepo = couponRepo;
    this.DEFAULT_DISCOUNT_PERCENT = parseFloat(process.env.DEFAULT_DISCOUNT_PERCENT) || 10;
  }

  /**
   * Create new coupon
   * Replaces couponNumber.txt file management from Java
   */
  async createCoupon(couponData) {
    const { couponCode, discountPercent, expiryDate, maxUsage } = couponData;

    if (!couponCode || couponCode.trim().length === 0) {
      throw new Error('Coupon code is required');
    }

    if (discountPercent === null || discountPercent === undefined || discountPercent <= 0 || discountPercent > 100) {
      throw new Error('Discount percent must be between 1 and 100');
    }

    const existingCoupon = await this.couponRepo.findByCode(couponCode.toUpperCase());
    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }

    return await this.couponRepo.create({
      couponCode: couponCode.toUpperCase(),
      discountPercent: parseFloat(discountPercent),
      expiryDate: expiryDate || null,
      maxUsage: maxUsage || null,
      usageCount: 0,
      isActive: true
    });
  }

  /**
   * Validate and apply coupon
   * Replaces PointOfSale.coupon() from Java
   */
  async validateCoupon(couponCode) {
    if (!couponCode) {
      throw new Error('Coupon code is required');
    }

    const coupon = await this.couponRepo.findByCode(couponCode.toUpperCase());
    
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new Error('Coupon is no longer active');
    }

    const now = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      throw new Error('Coupon has expired');
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      throw new Error('Coupon usage limit reached');
    }

    return coupon;
  }

  /**
   * Get coupon by code
   */
  async getCouponByCode(couponCode) {
    const coupon = await this.couponRepo.findByCode(couponCode.toUpperCase());
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return coupon;
  }

  /**
   * Get all coupons
   */
  async getAllCoupons(includeInactive = false) {
    return await this.couponRepo.findAll(includeInactive);
  }

  /**
   * Update coupon
   */
  async updateCoupon(couponCode, updates) {
    const coupon = await this.couponRepo.findByCode(couponCode.toUpperCase());
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    const updateData = {};
    
    if (updates.discountPercent !== undefined) {
      if (updates.discountPercent <= 0 || updates.discountPercent > 100) {
        throw new Error('Discount percent must be between 1 and 100');
      }
      updateData.discountPercent = parseFloat(updates.discountPercent);
    }
    
    if (updates.expiryDate !== undefined) {
      updateData.expiryDate = updates.expiryDate;
    }
    
    if (updates.maxUsage !== undefined) {
      updateData.maxUsage = updates.maxUsage;
    }
    
    if (updates.isActive !== undefined) {
      updateData.isActive = updates.isActive;
    }

    return await this.couponRepo.update(couponCode.toUpperCase(), updateData);
  }

  /**
   * Deactivate coupon
   */
  async deactivateCoupon(couponCode) {
    return await this.updateCoupon(couponCode, { isActive: false });
  }

  /**
   * Activate coupon
   */
  async activateCoupon(couponCode) {
    return await this.updateCoupon(couponCode, { isActive: true });
  }

  /**
   * Get active coupons
   */
  async getActiveCoupons() {
    const allCoupons = await this.couponRepo.findAll(false);
    const now = new Date();
    
    return allCoupons.filter(coupon => {
      if (!coupon.isActive) return false;
      if (coupon.expiryDate && new Date(coupon.expiryDate) < now) return false;
      if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) return false;
      return true;
    });
  }

  /**
   * Calculate discount amount
   */
  calculateDiscountAmount(subtotal, discountPercent) {
    return Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  }
}

export default CouponService;
