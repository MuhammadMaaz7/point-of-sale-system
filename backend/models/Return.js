/**
 * Return Model - Represents returned sale items
 * MySQL implementation
 * Eliminates data smell: Proper return tracking with reference to original sale
 */
class Return {
  constructor(data = {}) {
    this.returnId = data.returnId || null;
    this.saleId = data.saleId || null;
    this.itemId = data.itemId || null;
    this.itemName = data.itemName || null;
    this.quantity = data.quantity ? parseInt(data.quantity) : 0;
    this.refundAmount = data.refundAmount ? Math.round(parseFloat(data.refundAmount) * 100) / 100 : 0;
    this.reason = data.reason || null;
    this.employeeId = data.employeeId || null;
    this.returnDate = data.returnDate || null;
    this.createdAt = data.createdAt || null;
  }

  // Validation
  validate() {
    if (!this.itemId) {
      throw new Error('Item ID is required');
    }
    if (!this.employeeId) {
      throw new Error('Employee ID is required');
    }
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (this.refundAmount < 0) {
      throw new Error('Refund amount cannot be negative');
    }
  }

  // Convert to plain object
  toJSON() {
    return {
      returnId: this.returnId,
      saleId: this.saleId,
      itemId: this.itemId,
      itemName: this.itemName,
      quantity: this.quantity,
      refundAmount: this.refundAmount,
      reason: this.reason,
      employeeId: this.employeeId,
      returnDate: this.returnDate,
      createdAt: this.createdAt
    };
  }
}

export default Return;
