/**
 * Rental Model - Represents rental items (books, movies, etc.)
 * MySQL implementation
 * Eliminates data smell: Separate from sale items, proper availability tracking
 */
class Rental {
  constructor(data = {}) {
    this.rentalId = data.rentalId || null;
    this.name = data.name ? data.name.trim() : null;
    this.rentalPrice = data.rentalPrice ? Math.round(data.rentalPrice * 100) / 100 : 0;
    this.totalQuantity = data.totalQuantity !== undefined ? data.totalQuantity : 0;
    this.availableQuantity = data.availableQuantity !== undefined ? data.availableQuantity : 0;
    this.category = data.category ? data.category.trim() : 'General';
    this.isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.rentalId) {
      throw new Error('Rental ID is required');
    }
    if (this.rentalId.length > 10) {
      throw new Error('Rental ID cannot exceed 10 characters');
    }
    if (!this.name) {
      throw new Error('Rental name is required');
    }
    if (this.name.length > 100) {
      throw new Error('Rental name cannot exceed 100 characters');
    }
    if (this.rentalPrice < 0) {
      throw new Error('Rental price cannot be negative');
    }
    if (this.totalQuantity < 0) {
      throw new Error('Total quantity cannot be negative');
    }
    if (this.availableQuantity < 0) {
      throw new Error('Available quantity cannot be negative');
    }
    if (this.category.length > 50) {
      throw new Error('Category cannot exceed 50 characters');
    }
  }

  // Virtual for availability
  get available() {
    return this.availableQuantity > 0;
  }

  // Instance method to check availability
  isAvailable(requiredQuantity = 1) {
    return this.availableQuantity >= requiredQuantity;
  }

  // Convert to plain object
  toJSON() {
    return {
      rentalId: this.rentalId,
      name: this.name,
      rentalPrice: this.rentalPrice,
      totalQuantity: this.totalQuantity,
      availableQuantity: this.availableQuantity,
      category: this.category,
      isActive: this.isActive,
      available: this.available,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Rental;
