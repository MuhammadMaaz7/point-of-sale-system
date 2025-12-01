/**
 * User Model - Represents customers who rent items
 * MySQL implementation
 * Eliminates data smell: Normalized rental history into separate table
 */
class User {
  constructor(data = {}) {
    this.phoneNumber = data.phoneNumber || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!/^\d{10}$/.test(this.phoneNumber)) {
      throw new Error('Phone number must be 10 digits');
    }
  }

  // Virtual for formatted phone number
  get formattedPhone() {
    if (!this.phoneNumber) return '';
    const phone = this.phoneNumber;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }

  // Convert to plain object
  toJSON() {
    return {
      phoneNumber: this.phoneNumber,
      formattedPhone: this.formattedPhone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default User;
