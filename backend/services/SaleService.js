/**
 * SaleService - Business logic for sales operations
 * Refactored from Java POS, PointOfSale, Payment_Interface classes
 * MySQL implementation
 * Eliminates: God Class, Magic Numbers, Feature Envy, Duplicate Code, Derived Data
 */
class SaleService {
  constructor(saleRepo, itemRepo, couponRepo) {
    this.saleRepo = saleRepo;
    this.itemRepo = itemRepo;
    this.couponRepo = couponRepo;
    this.TAX_RATE = parseFloat(process.env.TAX_RATE) || 0.08;
    this.DISCOUNT_RATE = parseFloat(process.env.DISCOUNT_RATE) || 0.10;
  }

  /**
   * Process sale transaction
   * Replaces POS.endPOS() and PointOfSale logic from Java
   * Eliminates magic numbers (1.06 tax, 0.90f discount)
   */
  async processSale(employeeId, cartItems, couponCode = null) {
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    let subtotal = 0;
    const saleItems = [];

    for (const cartItem of cartItems) {
      const { itemId, quantity } = cartItem;

      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const item = await this.itemRepo.findById(itemId);
      
      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }
      
      if (item.quantity < quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${item.quantity}`);
      }

      const lineTotal = item.price * quantity;
      subtotal += lineTotal;

      saleItems.push({
        itemId: item.itemId,
        itemName: item.name,
        quantity,
        unitPrice: item.price,
        lineTotal
      });

      // Update inventory
      await this.itemRepo.updateQuantity(itemId, -quantity);
    }

    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await this.couponRepo.findByCode(couponCode);
      if (coupon && coupon.isValid) {
        discountAmount = coupon.calculateDiscount(subtotal);
        appliedCouponCode = couponCode;
        await this.couponRepo.incrementUsage(couponCode);
      }
    }

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = this.calculateTax(taxableAmount);
    const total = taxableAmount + taxAmount;

    const saleData = {
      employeeId,
      subtotal,
      taxAmount,
      total,
      couponCode: appliedCouponCode,
      discountAmount
    };

    const sale = await this.saleRepo.create(saleData, saleItems);

    return {
      sale,
      saleItems,
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }

  /**
   * Calculate tax amount
   * Replaces PointOfSale.taxCalculator() from Java
   * Eliminates magic number smell
   */
  calculateTax(amount) {
    return amount * this.TAX_RATE;
  }

  /**
   * Calculate discount amount
   * Replaces PointOfSale.coupon() logic from Java
   */
  calculateDiscount(amount, discountPercent) {
    const rate = discountPercent / 100;
    return Math.round(amount * rate * 100) / 100;
  }

  /**
   * Get sale by ID
   */
  async getSaleById(saleId) {
    const sale = await this.saleRepo.findById(saleId);
    if (!sale) {
      throw new Error(`Sale ${saleId} not found`);
    }
    return sale;
  }

  /**
   * Get all sales
   */
  async getAllSales() {
    return await this.saleRepo.findAll();
  }

  /**
   * Process return for a sale item
   */
  async processReturn(saleId, itemId, quantity, reason, employeeId) {
    const sale = await this.saleRepo.findById(saleId);
    if (!sale) {
      throw new Error(`Sale ${saleId} not found`);
    }

    // Find the sale item
    const saleItem = sale.items?.find(item => item.itemId === itemId);
    if (!saleItem) {
      throw new Error(`Item ${itemId} not found in sale ${saleId}`);
    }

    if (quantity > saleItem.quantity) {
      throw new Error(`Cannot return more than purchased quantity (${saleItem.quantity})`);
    }

    // Calculate refund amount
    const refundAmount = saleItem.unitPrice * quantity;

    // Update inventory - add items back
    await this.itemRepo.updateQuantity(itemId, quantity);

    // Create return record
    const returnData = {
      saleId,
      itemId,
      quantity,
      refundAmount,
      reason: reason || 'No reason provided',
      processedBy: employeeId
    };

    const returnRecord = await this.saleRepo.createReturn(returnData);

    return {
      returnRecord,
      refundAmount,
      message: 'Return processed successfully'
    };
  }
}

export default SaleService;
