/**
 * Item Model - Represents products for sale
 * MySQL implementation
 * Eliminates data smell: Proper inventory tracking, decimal precision
 */
class Item {
  constructor(data = {}) {
    this.itemId = data.itemId || null;
    this.name = data.name ? data.name.trim() : null;
    this.price = data.price ? Math.round(data.price * 100) / 100 : 0;
    this.quantity = data.quantity !== undefined ? data.quantity : 0;
    this.category = data.category ? data.category.trim() : 'General';
    this.isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.itemId) {
      throw new Error('Item ID is required');
    }
    if (this.itemId.length > 10) {
      throw new Error('Item ID cannot exceed 10 characters');
    }
    if (!this.name) {
      throw new Error('Item name is required');
    }
    if (this.name.length > 100) {
      throw new Error('Item name cannot exceed 100 characters');
    }
    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (this.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (this.category.length > 50) {
      throw new Error('Category cannot exceed 50 characters');
    }
  }

  // Virtual for stock status
  get inStock() {
    return this.quantity > 0;
  }

  // Instance method to check stock
  isInStock(requiredQuantity = 1) {
    return this.quantity >= requiredQuantity;
  }

  // Convert to plain object
  toJSON() {
    return {
      itemId: this.itemId,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      category: this.category,
      isActive: this.isActive,
      inStock: this.inStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Item;
