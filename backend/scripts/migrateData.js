/**
 * Data Migration Script
 * Converts old text-based data to MySQL database
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function migrateEmployees(connection, filePath) {
  console.log('Migrating employees...');
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    const [employeeId, role, firstName, lastName, password] = line.split(' ');
    const passwordHash = await bcrypt.hash(password || 'default123', 10);
    
    await connection.execute(
      'INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) VALUES (?, ?, ?, ?, ?)',
      [employeeId, role, firstName, lastName, passwordHash]
    );
  }
  console.log(`Migrated ${lines.length} employees`);
}

async function migrateItems(connection, filePath) {
  console.log('Migrating items...');
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    const [itemId, name, price, quantity] = line.split(' ');
    
    await connection.execute(
      'INSERT INTO items (itemId, name, price, quantity) VALUES (?, ?, ?, ?)',
      [itemId, name, parseFloat(price), parseInt(quantity)]
    );
  }
  console.log(`Migrated ${lines.length} items`);
}

async function migrateRentals(connection, filePath) {
  console.log('Migrating rentals...');
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    const [rentalId, name, price, quantity] = line.split(' ');
    
    await connection.execute(
      'INSERT INTO rentals (rentalId, name, rentalPrice, totalQuantity, availableQuantity) VALUES (?, ?, ?, ?, ?)',
      [rentalId, name, parseFloat(price), parseInt(quantity), parseInt(quantity)]
    );
  }
  console.log(`Migrated ${lines.length} rentals`);
}

async function migrateUserRentals(connection, filePath) {
  console.log('Migrating user rentals...');
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    const parts = line.split(' ');
    const phoneNumber = parts[0];
    
    // Insert user if not exists
    await connection.execute(
      'INSERT IGNORE INTO users (phoneNumber) VALUES (?)',
      [phoneNumber]
    );
    
    // Parse rental records
    for (let i = 1; i < parts.length; i++) {
      const [rentalId, dateStr, returnedStr] = parts[i].split(',');
      const isReturned = returnedStr === 'true';
      
      const rentalDate = new Date(dateStr);
      const dueDate = new Date(rentalDate);
      dueDate.setDate(dueDate.getDate() + 14);
      
      await connection.execute(
        `INSERT INTO user_rentals (phoneNumber, rentalId, rentalDate, dueDate, isReturned, returnDate) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [phoneNumber, rentalId, rentalDate, dueDate, isReturned, isReturned ? new Date() : null]
      );
    }
  }
  console.log(`Migrated user rentals`);
}

async function migrateCoupons(connection, filePath) {
  console.log('Migrating coupons...');
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    const couponCode = line.trim();
    
    await connection.execute(
      'INSERT INTO coupons (couponCode, discountType, discountValue, minPurchaseAmount) VALUES (?, ?, ?, ?)',
      [couponCode, 'percentage', 10.00, 20.00]
    );
  }
  console.log(`Migrated ${lines.length} coupons`);
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pos_db'
  });

  try {
    console.log('Starting data migration...');
    
    // Migrate in order due to foreign key constraints
    await migrateEmployees(connection, './data/employeeDatabase.txt');
    await migrateItems(connection, './data/itemDatabase.txt');
    await migrateRentals(connection, './data/rentalDatabase.txt');
    await migrateUserRentals(connection, './data/userDatabase.txt');
    await migrateCoupons(connection, './data/couponNumber.txt');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

main();
