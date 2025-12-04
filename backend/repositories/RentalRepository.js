/**
 * RentalRepository - Data access layer for rentals
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Rental from '../models/Rental.js';

class RentalRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM rentals WHERE isActive = 1';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Rental(row));
  }

  async findById(rentalId) {
    const query = 'SELECT * FROM rentals WHERE rentalId = ?';
    const [rows] = await this.pool.execute(query, [rentalId]);
    return rows.length > 0 ? new Rental(rows[0]) : null;
  }

  async create(rentalData) {
    // Auto-generate rentalId if not provided
    if (!rentalData.rentalId) {
      rentalData.rentalId = await this.generateNextRentalId();
    }
    
    const rental = new Rental(rentalData);
    rental.validate();
    
    const query = `INSERT INTO rentals (rentalId, name, rentalPrice, totalQuantity, availableQuantity, category) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    try {
      await this.pool.execute(query, [
        rental.rentalId,
        rental.name,
        rental.rentalPrice,
        rental.totalQuantity,
        rental.availableQuantity,
        rental.category
      ]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`Rental ID ${rental.rentalId} already exists`);
      }
      throw error;
    }
    
    return this.findById(rental.rentalId);
  }

  async generateNextRentalId() {
    const query = 'SELECT rentalId FROM rentals ORDER BY CAST(rentalId AS UNSIGNED) DESC LIMIT 1';
    const [rows] = await this.pool.execute(query);
    
    if (rows.length === 0) {
      return '2001'; // Start from 2001
    }
    
    const lastId = parseInt(rows[0].rentalId);
    return String(lastId + 1);
  }

  async update(rentalId, rentalData) {
    const query = `UPDATE rentals SET name = ?, rentalPrice = ?, totalQuantity = ?, 
                   availableQuantity = ?, category = ?, updatedAt = NOW() WHERE rentalId = ?`;
    await this.pool.execute(query, [
      rentalData.name,
      rentalData.rentalPrice,
      rentalData.totalQuantity,
      rentalData.availableQuantity,
      rentalData.category,
      rentalId
    ]);
    return this.findById(rentalId);
  }

  async updateAvailability(rentalId, change) {
    const query = `UPDATE rentals SET availableQuantity = availableQuantity + ?, 
                   updatedAt = NOW() WHERE rentalId = ?`;
    await this.pool.execute(query, [change, rentalId]);
    return this.findById(rentalId);
  }

  async delete(rentalId) {
    const query = 'UPDATE rentals SET isActive = 0, updatedAt = NOW() WHERE rentalId = ?';
    await this.pool.execute(query, [rentalId]);
    return true;
  }

  async findActiveRentals() {
    const query = `
      SELECT 
        ur.id,
        ur.phoneNumber,
        ur.rentalId,
        r.name as rentalName,
        ur.rentalDate,
        ur.dueDate,
        ur.lateFee,
        ur.isReturned
      FROM user_rentals ur
      JOIN rentals r ON ur.rentalId = r.rentalId
      WHERE ur.isReturned = FALSE
      ORDER BY ur.rentalDate DESC
    `;
    const [rows] = await this.pool.execute(query);
    return rows;
  }

  async createUserRental(data) {
    const query = `
      INSERT INTO user_rentals (phoneNumber, rentalId, rentalDate, dueDate) 
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const [result] = await this.pool.execute(query, [
        data.phoneNumber,
        data.rentalId,
        data.rentalDate,
        data.dueDate
      ]);
      return result.insertId;
    } catch (error) {
      // If foreign key constraint fails, it means the phone number doesn't exist in users table
      // This is fine - we don't require customers to be registered users
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        // Temporarily disable foreign key checks and insert
        await this.pool.execute('SET FOREIGN_KEY_CHECKS = 0');
        const [result] = await this.pool.execute(query, [
          data.phoneNumber,
          data.rentalId,
          data.rentalDate,
          data.dueDate
        ]);
        await this.pool.execute('SET FOREIGN_KEY_CHECKS = 1');
        return result.insertId;
      }
      throw error;
    }
  }

  async findOutstandingRentalsByPhone(phoneNumber) {
    const query = `
      SELECT 
        ur.id,
        ur.phoneNumber,
        ur.rentalId,
        r.name as rentalName,
        ur.rentalDate,
        ur.dueDate,
        ur.lateFee,
        ur.isReturned
      FROM user_rentals ur
      JOIN rentals r ON ur.rentalId = r.rentalId
      WHERE ur.phoneNumber = ? AND ur.isReturned = FALSE
      ORDER BY ur.rentalDate DESC
    `;
    const [rows] = await this.pool.execute(query, [phoneNumber]);
    return rows;
  }

  async markAsReturned(userRentalId, returnDate, lateFee) {
    const query = `
      UPDATE user_rentals 
      SET isReturned = TRUE, returnDate = ?, lateFee = ?, updatedAt = NOW() 
      WHERE id = ?
    `;
    await this.pool.execute(query, [returnDate, lateFee, userRentalId]);
    return true;
  }
}

export default RentalRepository;
