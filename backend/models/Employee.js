/**
 * Employee Model - Represents system users (Admin/Cashier)
 * MySQL implementation
 * Eliminates data smell: Proper password hashing, role-based access
 */
class Employee {
  static ROLES = {
    ADMIN: 'Admin',
    CASHIER: 'Cashier'
  };

  constructor(data = {}) {
    this.employeeId = data.employeeId || null;
    this.role = data.role || null;
    this.firstName = data.firstName ? data.firstName.trim() : null;
    this.lastName = data.lastName ? data.lastName.trim() : null;
    this.passwordHash = data.passwordHash || null;
    this.isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Validation
  validate() {
    if (!this.employeeId) {
      throw new Error('Employee ID is required');
    }
    if (this.employeeId.length > 10) {
      throw new Error('Employee ID cannot exceed 10 characters');
    }
    if (!this.role) {
      throw new Error('Role is required');
    }
    if (!['Admin', 'Cashier'].includes(this.role)) {
      throw new Error(`${this.role} is not a valid role`);
    }
    if (!this.firstName) {
      throw new Error('First name is required');
    }
    if (this.firstName.length > 50) {
      throw new Error('First name cannot exceed 50 characters');
    }
    if (!this.lastName) {
      throw new Error('Last name is required');
    }
    if (this.lastName.length > 50) {
      throw new Error('Last name cannot exceed 50 characters');
    }
  }

  // Virtual for full name
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Static method to get roles
  static getRoles() {
    return Employee.ROLES;
  }

  // Instance method to check if admin
  isAdmin() {
    return this.role === 'Admin';
  }

  // Instance method to check if cashier
  isCashier() {
    return this.role === 'Cashier';
  }

  // Convert to plain object (exclude password by default)
  toJSON() {
    return {
      employeeId: this.employeeId,
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Employee;
