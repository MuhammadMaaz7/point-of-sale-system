/**
 * UserService - Business logic for user/customer management
 * Refactored from Java Management class user operations
 * MySQL implementation
 * Eliminates: Primitive Obsession, Duplicate Code, Unnormalized Data
 */
class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  /**
   * Create new user
   * Replaces Management.createUser() from Java
   */
  async createUser(phoneNumber) {
    this.validatePhoneNumber(phoneNumber);

    const existingUser = await this.userRepo.findById(phoneNumber);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.userRepo.create({ phoneNumber });
  }

  /**
   * Get user by phone number
   * Replaces Management.checkUser() from Java
   */
  async getUserByPhone(phoneNumber) {
    this.validatePhoneNumber(phoneNumber);

    const user = await this.userRepo.findById(phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Check if user exists
   */
  async userExists(phoneNumber) {
    this.validatePhoneNumber(phoneNumber);
    const user = await this.userRepo.findById(phoneNumber);
    return user !== null;
  }

  /**
   * Get or create user
   * Common pattern for rental operations
   */
  async getOrCreateUser(phoneNumber) {
    this.validatePhoneNumber(phoneNumber);

    let user = await this.userRepo.findById(phoneNumber);
    if (!user) {
      user = await this.userRepo.create({ phoneNumber });
    }

    return user;
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    return await this.userRepo.findAll();
  }

  /**
   * Validate phone number
   * Eliminates primitive obsession smell
   */
  validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const phoneStr = phoneNumber.toString().replace(/\D/g, '');
    
    if (phoneStr.length !== 10) {
      throw new Error('Phone number must be 10 digits');
    }

    return phoneStr;
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.toString().replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  }
}

export default UserService;
