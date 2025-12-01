/**
 * ItemRepository - Data access layer for sale items
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Item from '../models/Item.js';

class ItemRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM items WHERE isActive = 1';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Item(row));
  }

  async findById(itemId) {
    const query = 'SELECT * FROM items WHERE itemId = ?';
    const [rows] = await this.pool.execute(query, [itemId]);
    return rows.length > 0 ? new Item(rows[0]) : null;
  }

  async create(itemData) {
    const item = new Item(itemData);
    item.validate();
    
    const query = `INSERT INTO items (itemId, name, price, quantity, category) 
                   VALUES (?, ?, ?, ?, ?)`;
    await this.pool.execute(query, [
      item.itemId,
      item.name,
      item.price,
      item.quantity,
      item.category
    ]);
    
    return this.findById(item.itemId);
  }

  async update(itemId, itemData) {
    const query = `UPDATE items SET name = ?, price = ?, quantity = ?, category = ?, updatedAt = NOW() 
                   WHERE itemId = ?`;
    await this.pool.execute(query, [
      itemData.name,
      itemData.price,
      itemData.quantity,
      itemData.category,
      itemId
    ]);
    return this.findById(itemId);
  }

  async updateQuantity(itemId, quantityChange) {
    const query = `UPDATE items SET quantity = quantity + ?, updatedAt = NOW() 
                   WHERE itemId = ?`;
    await this.pool.execute(query, [quantityChange, itemId]);
    return this.findById(itemId);
  }

  async delete(itemId) {
    const query = 'UPDATE items SET isActive = 0, updatedAt = NOW() WHERE itemId = ?';
    await this.pool.execute(query, [itemId]);
    return true;
  }
}

export default ItemRepository;
