/**
 * Sale Model - Represents a complete sale transaction
 * MySQL implementation
 * Eliminates data smell: Proper transaction structure with line items
 */
class Sale {
  constructor(data = {}) {
    this.saleId = data.saleId || null;
    this.employeeId = data.employeeId || null;
    this.subtotal = data.subtotal ? Math.round(data.subtotal * 100) / 100 : 0;
    this.taxAmount = data.taxAmount ? Math.round(data.taxAmount * 100) / 100 : 0;
    this.total = data.total ? Math.round(data.total * 100) / 100 : 0;
    this.couponCode = data.couponCode ? data.couponCode.trim() : null;
    this.discountAmount = data.discountAmount ? Math.round(data.discountAmount * 100) / 100 : 0;
    this.saleDate = data.saleDate || null;
    this.createdAt = data.createdAt || null;
    this.items = data.items || [];
  }

  // Validation
  validate() {
    if (!this.employeeId) {
      throw new Error('Employee ID is required');
    }
    if (this.subtotal < 0) {
      throw new Error('Subtotal cannot be negative');
    }
    if (this.taxAmount < 0) {
      throw new Error('Tax amount cannot be negative');
    }
    if (this.total < 0) {
      throw new Error('Total cannot be negative');
    }
    if (this.discountAmount < 0) {
      throw new Error('Discount amount cannot be negative');
    }
  }

  // Convert to plain object
  toJSON() {
    return {
      saleId: this.saleId,
      employeeId: this.employeeId,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      total: this.total,
      couponCode: this.couponCode,
      discountAmount: this.discountAmount,
      discount: this.discountAmount, // Alias for frontend compatibility
      saleDate: this.saleDate,
      createdAt: this.createdAt,
      items: this.items.map(item => item.toJSON ? item.toJSON() : item)
    };
  }
}

export default Sale;
