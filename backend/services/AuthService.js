/**
 * AuthService - Business logic for authentication and employee management
 * Refactored from Java EmployeeManagement class
 * MySQL implementation
 * Eliminates: God Class, Tight Coupling, Plain Text Passwords, Duplicate Code
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  constructor(employeeRepo) {
    this.employeeRepo = employeeRepo;
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.TOKEN_EXPIRY = '8h';
    this.SALT_ROUNDS = 10;
  }

  /**
   * Authenticate employee and generate JWT token
   * Replaces Login_Interface logic from Java
   */
  async login(employeeId, password) {
    const employee = await this.employeeRepo.findByIdWithPassword(employeeId);
    
    if (!employee || !employee.isActive) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, employee.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { employeeId: employee.employeeId, role: employee.role },
      this.JWT_SECRET,
      { expiresIn: this.TOKEN_EXPIRY }
    );

    return { 
      employee: {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role
      }, 
      token 
    };
  }

  /**
   * Log employee out
   */
  async logout(employeeId) {
    // Can add logout logic here if needed
    return true;
  }

  /**
   * Add new employee
   * Replaces EmployeeManagement.add() from Java
   */
  async addEmployee(employeeData) {
    const { employeeId, firstName, lastName, role, password } = employeeData;

    if (!['Admin', 'Cashier'].includes(role)) {
      throw new Error('Invalid role. Must be Admin or Cashier');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const passwordHash = await this.hashPassword(password);

    const employee = await this.employeeRepo.create({
      employeeId,
      firstName,
      lastName,
      role,
      passwordHash,
      isActive: true
    });

    return employee;
  }

  /**
   * Update employee information
   * Replaces EmployeeManagement.update() from Java
   */
  async updateEmployee(employeeId, updates) {
    const { firstName, lastName, role, password } = updates;

    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (role && !['Admin', 'Cashier'].includes(role)) {
      throw new Error('Invalid role. Must be Admin or Cashier');
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (password) {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      updateData.passwordHash = await this.hashPassword(password);
    }

    const updatedEmployee = await this.employeeRepo.update(employeeId, updateData);

    return updatedEmployee;
  }

  /**
   * Deactivate employee (soft delete)
   * Replaces EmployeeManagement.delete() from Java
   */
  async deactivateEmployee(employeeId) {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    await this.employeeRepo.update(employeeId, { isActive: false });

    return true;
  }

  /**
   * Get all active employees
   * Replaces EmployeeManagement.getEmployeeList() from Java
   */
  async getAllEmployees() {
    return await this.employeeRepo.findAll();
  }

  /**
   * Hash password securely
   * Eliminates plain text password smell from Java
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, this.JWT_SECRET);
  }
}

export default AuthService;
