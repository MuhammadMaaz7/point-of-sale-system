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
    const rental = new Rental(rentalData);
    rental.validate();
    
    const query = `INSERT INTO rentals (rentalId, name, rentalPrice, totalQuantity, availableQuantity, category) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    await this.pool.execute(query, [
      rental.rentalId,
      rental.name,
      rental.rentalPrice,
      rental.totalQuantity,
      rental.availableQuantity,
      rental.category
    ]);
    
    return this.findById(rental.rentalId);
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
}

export default RentalRepository;
