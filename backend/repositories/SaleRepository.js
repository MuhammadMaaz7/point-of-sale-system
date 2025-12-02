/**
 * SaleRepository - Data access layer for sales
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';

class SaleRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM sales ORDER BY saleDate DESC';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Sale(row));
  }

  async findById(saleId) {
    const query = 'SELECT * FROM sales WHERE saleId = ?';
    const [rows] = await this.pool.execute(query, [saleId]);
    return rows.length > 0 ? new Sale(rows[0]) : null;
  }

  async findWithItems(saleId) {
    const sale = await this.findById(saleId);
    if (!sale) return null;
    
    const itemsQuery = 'SELECT * FROM sale_items WHERE saleId = ?';
    const [items] = await this.pool.execute(itemsQuery, [saleId]);
    sale.items = items.map(item => new SaleItem(item));
    
    return sale;
  }

  async create(saleData, saleItems) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const sale = new Sale(saleData);
      sale.validate();
      
      const saleQuery = `INSERT INTO sales (employeeId, subtotal, taxAmount, total, 
                         couponCode, discountAmount) VALUES (?, ?, ?, ?, ?, ?)`;
      const [result] = await connection.execute(saleQuery, [
        sale.employeeId,
        sale.subtotal,
        sale.taxAmount,
        sale.total,
        sale.couponCode,
        sale.discountAmount
      ]);
      
      sale.saleId = result.insertId;
      
      for (const itemData of saleItems) {
        const saleItem = new SaleItem({ ...itemData, saleId: sale.saleId });
        saleItem.validate();
        
        const itemQuery = `INSERT INTO sale_items (saleId, itemId, itemName, quantity, 
                          unitPrice, lineTotal) VALUES (?, ?, ?, ?, ?, ?)`;
        await connection.execute(itemQuery, [
          saleItem.saleId,
          saleItem.itemId,
          saleItem.itemName,
          saleItem.quantity,
          saleItem.unitPrice,
          saleItem.lineTotal
        ]);
      }
      
      await connection.commit();
      return sale;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(saleId) {
    const query = 'DELETE FROM sales WHERE saleId = ?';
    await this.pool.execute(query, [saleId]);
    return true;
  }

  async findByDateRange(startDate, endDate) {
    let query = 'SELECT * FROM sales';
    const params = [];
    
    if (startDate && endDate) {
      query += ' WHERE saleDate BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE saleDate >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE saleDate <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY saleDate DESC';
    
    const [rows] = await this.pool.execute(query, params);
    return rows.map(row => new Sale(row));
  }

  async createReturn(returnData) {
    // Get item name from items table
    const itemQuery = 'SELECT name FROM items WHERE itemId = ?';
    const [itemRows] = await this.pool.execute(itemQuery, [returnData.itemId]);
    const itemName = itemRows.length > 0 ? itemRows[0].name : 'Unknown Item';
    
    const query = `INSERT INTO returns (saleId, itemId, itemName, quantity, refundAmount, reason, employeeId) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await this.pool.execute(query, [
      returnData.saleId,
      returnData.itemId,
      itemName,
      returnData.quantity,
      returnData.refundAmount,
      returnData.reason,
      returnData.processedBy
    ]);
    
    return {
      returnId: result.insertId,
      ...returnData,
      itemName
    };
  }
}

export default SaleRepository;
