/**
 * Seed Data Script for MySQL
 * Creates initial data for development and testing
 */
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedData() {
  let connection;
  
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pos_db'
    });
    
    console.log('✓ Connected to MySQL');
    console.log(`✓ Database: ${process.env.DB_NAME || 'pos_db'}\n`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE employee_logs');
    await connection.execute('TRUNCATE TABLE returns');
    await connection.execute('TRUNCATE TABLE sale_items');
    await connection.execute('TRUNCATE TABLE sales');
    await connection.execute('TRUNCATE TABLE user_rentals');
    await connection.execute('TRUNCATE TABLE users');
    await connection.execute('TRUNCATE TABLE coupons');
    await connection.execute('TRUNCATE TABLE rentals');
    await connection.execute('TRUNCATE TABLE items');
    await connection.execute('TRUNCATE TABLE employees');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Existing data cleared\n');

    // Create employees
    console.log('👥 Creating employees...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const cashierPassword = await bcrypt.hash('cashier123', 10);

    await connection.execute(
      'INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) VALUES (?, ?, ?, ?, ?)',
      ['110001', 'Admin', 'Admin', 'User', adminPassword]
    );
    await connection.execute(
      'INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) VALUES (?, ?, ?, ?, ?)',
      ['110002', 'Cashier', 'John', 'Doe', cashierPassword]
    );
    await connection.execute(
      'INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) VALUES (?, ?, ?, ?, ?)',
      ['110003', 'Cashier', 'Jane', 'Smith', cashierPassword]
    );
    
    console.log('✓ Created 3 employees');
    console.log('  - Admin (ID: 110001, Password: admin123)');
    console.log('  - Cashier (ID: 110002, Password: cashier123)');
    console.log('  - Cashier (ID: 110003, Password: cashier123)\n');

    // Create items
    console.log('📦 Creating items...');
    const items = [
      ['1001', 'Laptop - Dell XPS 15', 999.99, 10, 'Electronics'],
      ['1002', 'Wireless Mouse', 29.99, 50, 'Accessories'],
      ['1003', 'Mechanical Keyboard', 79.99, 30, 'Accessories'],
      ['1004', '27" Monitor', 299.99, 15, 'Electronics'],
      ['1005', 'USB-C Hub', 49.99, 25, 'Accessories'],
      ['1006', 'Webcam HD', 89.99, 20, 'Electronics'],
      ['1007', 'Headphones', 149.99, 35, 'Audio'],
      ['1008', 'External SSD 1TB', 129.99, 18, 'Storage'],
      ['1009', 'Laptop Stand', 39.99, 40, 'Accessories'],
      ['1010', 'Cable Organizer', 14.99, 100, 'Accessories']
    ];

    for (const item of items) {
      await connection.execute(
        'INSERT INTO items (itemId, name, price, quantity, category) VALUES (?, ?, ?, ?, ?)',
        item
      );
    }
    console.log('✓ Created 10 items\n');

    // Create rentals
    console.log('🎬 Creating rental items...');
    const rentals = [
      ['2001', 'Projector - 4K', 50.00, 5, 5, 'Equipment'],
      ['2002', 'DSLR Camera', 75.00, 3, 3, 'Equipment'],
      ['2003', 'Microphone Set', 35.00, 8, 8, 'Audio'],
      ['2004', 'Portable Speaker', 25.00, 10, 10, 'Audio'],
      ['2005', 'Tripod Stand', 15.00, 12, 12, 'Equipment']
    ];

    for (const rental of rentals) {
      await connection.execute(
        'INSERT INTO rentals (rentalId, name, rentalPrice, totalQuantity, availableQuantity, category) VALUES (?, ?, ?, ?, ?, ?)',
        rental
      );
    }
    console.log('✓ Created 5 rental items\n');

    // Create coupons
    console.log('🎟️  Creating coupons...');
    const coupons = [
      ['SAVE10', 'percentage', 10.00, 20.00, null, '2025-12-31', 100],
      ['SAVE20', 'percentage', 20.00, 50.00, null, '2025-12-31', 50],
      ['WELCOME15', 'percentage', 15.00, 0.00, null, '2025-06-30', 200],
      ['HOLIDAY25', 'percentage', 25.00, 100.00, null, '2025-01-31', 30]
    ];

    for (const coupon of coupons) {
      await connection.execute(
        'INSERT INTO coupons (couponCode, discountType, discountValue, minPurchaseAmount, maxDiscountAmount, expirationDate, usageLimit) VALUES (?, ?, ?, ?, ?, ?, ?)',
        coupon
      );
    }
    console.log('✓ Created 4 coupons');
    console.log('  - SAVE10 (10% off)');
    console.log('  - SAVE20 (20% off)');
    console.log('  - WELCOME15 (15% off)');
    console.log('  - HOLIDAY25 (25% off)\n');

    // Create sample users
    console.log('👤 Creating sample users...');
    await connection.execute('INSERT INTO users (phoneNumber) VALUES (?)', ['5551234567']);
    await connection.execute('INSERT INTO users (phoneNumber) VALUES (?)', ['5559876543']);
    await connection.execute('INSERT INTO users (phoneNumber) VALUES (?)', ['5555555555']);
    console.log('✓ Created 3 sample users\n');

    // Summary
    const [employeeCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    const [itemCount] = await connection.execute('SELECT COUNT(*) as count FROM items');
    const [rentalCount] = await connection.execute('SELECT COUNT(*) as count FROM rentals');
    const [couponCount] = await connection.execute('SELECT COUNT(*) as count FROM coupons');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');

    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`  • Employees: ${employeeCount[0].count}`);
    console.log(`  • Items: ${itemCount[0].count}`);
    console.log(`  • Rentals: ${rentalCount[0].count}`);
    console.log(`  • Coupons: ${couponCount[0].count}`);
    console.log(`  • Users: ${userCount[0].count}`);
    console.log('\n🔐 Login Credentials:');
    console.log('  Employee ID: 110001');
    console.log('  Password: admin123');
    console.log('\n🚀 Ready to start the application!');
    console.log('  Run: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run seed function
seedData();
