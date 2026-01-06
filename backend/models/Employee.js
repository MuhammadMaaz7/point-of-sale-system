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
    this.contactNumber = data.contactNumber ? data.contactNumber.trim() : null;
    this.email = data.email ? data.email.trim() : null;
    this.position = data.position ? data.position.trim() : null;
    this.department = data.department ? data.department.trim() : null;
    this.dateOfJoining = data.dateOfJoining || null;
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
    if (!this.contactNumber) {
      throw new Error('Contact number is required');
    }
    const digitsOnly = this.contactNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      throw new Error('Contact number must be 10 digits');
    }
    this.contactNumber = digitsOnly;
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Email must be valid');
    }
    if (this.email.length > 100) {
      throw new Error('Email cannot exceed 100 characters');
    }
    if (!this.position) {
      throw new Error('Position is required');
    }
    if (this.position.length > 100) {
      throw new Error('Position cannot exceed 100 characters');
    }
    if (!this.department) {
      throw new Error('Department is required');
    }
    if (this.department.length > 100) {
      throw new Error('Department cannot exceed 100 characters');
    }
    if (!this.dateOfJoining) {
      throw new Error('Date of joining is required');
    }
    const date = new Date(this.dateOfJoining);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Date of joining must be a valid date');
    }
    this.dateOfJoining = date.toISOString().split('T')[0];
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
      contactNumber: this.contactNumber,
      email: this.email,
      position: this.position,
      department: this.department,
      dateOfJoining: this.dateOfJoining,
      fullName: this.fullName,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Employee;
