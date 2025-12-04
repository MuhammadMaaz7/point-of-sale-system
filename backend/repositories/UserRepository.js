/**
 * UserRepository - Data access layer for users
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT phoneNumber, createdAt, updatedAt FROM users';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new User(row));
  }

  async findById(identifier) {
    // identifier can be userId or phoneNumber
    // Since phoneNumber is the primary key, we search by it
    const query = 'SELECT phoneNumber, createdAt, updatedAt FROM users WHERE phoneNumber = ?';
    const [rows] = await this.pool.execute(query, [identifier]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  async findByIdWithPassword(identifier) {
    const query = 'SELECT * FROM users WHERE phoneNumber = ?';
    const [rows] = await this.pool.execute(query, [identifier]);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(userData) {
    const user = new User(userData);
    user.validate();
    
    const query = 'INSERT INTO users (phoneNumber, passwordHash) VALUES (?, ?)';
    
    try {
      await this.pool.execute(query, [user.phoneNumber, user.passwordHash || null]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`User with phone number ${user.phoneNumber} already exists`);
      }
      throw error;
    }
    
    return this.findById(user.phoneNumber);
  }

  async delete(phoneNumber) {
    const query = 'DELETE FROM users WHERE phoneNumber = ?';
    await this.pool.execute(query, [phoneNumber]);
    return true;
  }
}

export default UserRepository;
