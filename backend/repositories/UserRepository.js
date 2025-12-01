/**
 * UserRepository - Data access layer for users
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM users';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new User(row));
  }

  async findById(phoneNumber) {
    const query = 'SELECT * FROM users WHERE phoneNumber = ?';
    const [rows] = await this.pool.execute(query, [phoneNumber]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  async create(userData) {
    const user = new User(userData);
    user.validate();
    
    const query = 'INSERT INTO users (phoneNumber) VALUES (?)';
    await this.pool.execute(query, [user.phoneNumber]);
    
    return this.findById(user.phoneNumber);
  }

  async delete(phoneNumber) {
    const query = 'DELETE FROM users WHERE phoneNumber = ?';
    await this.pool.execute(query, [phoneNumber]);
    return true;
  }
}

export default UserRepository;
