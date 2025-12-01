/**
 * UserRental Model - Junction table for user rental transactions
 * MySQL implementation
 * Eliminates data smell: Normalized many-to-many relationship
 */
class UserRental {
  constructor(data = {}) {
    this.id = data.id || null;
    this.phoneNumber = data.phoneNumber || null;
    this.rentalId = data.rentalId || null;
    this.rentalDate = data.rentalDate || null;
    this.dueDate = data.dueDate || null;
    this.returnDate = data.returnDate || null;
    this.isReturned = data.isReturned !== undefined ? Boolean(data.isReturned) : false;
    this.lateFee = data.lateFee ? Math.round(data.lateFee * 100) / 100 : 0;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!this.rentalId) {
      throw new Error('Rental ID is required');
    }
    if (!this.dueDate) {
      throw new Error('Due date is required');
    }
    if (this.lateFee < 0) {
      throw new Error('Late fee cannot be negative');
    }
  }

  // Virtual for overdue status
  get isOverdue() {
    if (this.isReturned) return false;
    return new Date() > new Date(this.dueDate);
  }

  // Virtual for days late
  get daysLate() {
    if (this.isReturned || !this.isOverdue) return 0;
    const diffTime = new Date() - new Date(this.dueDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Instance method to calculate late fee
  calculateLateFee(rentalPrice, lateFeeRate = 0.10) {
    if (!this.isOverdue) return 0;
    const daysLate = this.daysLate;
    return Math.round(rentalPrice * lateFeeRate * daysLate * 100) / 100;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      phoneNumber: this.phoneNumber,
      rentalId: this.rentalId,
      rentalDate: this.rentalDate,
      dueDate: this.dueDate,
      returnDate: this.returnDate,
      isReturned: this.isReturned,
      lateFee: this.lateFee,
      isOverdue: this.isOverdue,
      daysLate: this.daysLate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default UserRental;
