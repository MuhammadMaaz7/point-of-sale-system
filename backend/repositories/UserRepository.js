/**
 * UserRepository - Data access layer for users
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT userId, phoneNumber, createdAt, updatedAt FROM users';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new User(row));
  }

  async findById(userId) {
    const query = 'SELECT userId, phoneNumber, createdAt, updatedAt FROM users WHERE userId = ?';
    const [rows] = await this.pool.execute(query, [userId]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  async findByIdWithPassword(userId) {
    const query = 'SELECT * FROM users WHERE userId = ?';
    const [rows] = await this.pool.execute(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(userData) {
    const user = new User(userData);
    user.validate();
    
    const query = 'INSERT INTO users (userId, phoneNumber, passwordHash) VALUES (?, ?, ?)';
    await this.pool.execute(query, [user.userId, user.phoneNumber || null, user.passwordHash]);
    
    return this.findById(user.userId);
  }

  async delete(userId) {
    const query = 'DELETE FROM users WHERE userId = ?';
    await this.pool.execute(query, [userId]);
    return true;
  }
}

export default UserRepository;
