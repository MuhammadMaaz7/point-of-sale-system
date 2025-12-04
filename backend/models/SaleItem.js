/**
 * SaleItem Model - Represents individual items in a sale
 * MySQL implementation
 * Eliminates data smell: Normalized line items, proper quantity tracking
 */
class SaleItem {
  constructor(data = {}) {
    this.id = data.id || null;
    this.saleId = data.saleId || null;
    this.itemId = data.itemId || null;
    this.itemName = data.itemName ? data.itemName.trim() : null;
    this.quantity = data.quantity || 0;
    this.unitPrice = data.unitPrice ? Math.round(data.unitPrice * 100) / 100 : 0;
    this.lineTotal = data.lineTotal ? Math.round(data.lineTotal * 100) / 100 : this.calculateLineTotal();
    this.createdAt = data.createdAt || null;
  }

  // Calculate line total
  calculateLineTotal() {
    return Math.round(this.quantity * this.unitPrice * 100) / 100;
  }

  // Validation
  validate() {
    if (!this.saleId) {
      throw new Error('Sale ID is required');
    }
    if (!this.itemId) {
      throw new Error('Item ID is required');
    }
    if (!this.itemName) {
      throw new Error('Item name is required');
    }
    if (this.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (this.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      saleId: this.saleId,
      itemId: this.itemId,
      itemName: this.itemName,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      price: this.unitPrice, // Alias for frontend compatibility
      lineTotal: this.lineTotal,
      createdAt: this.createdAt
    };
  }
}

export default SaleItem;
