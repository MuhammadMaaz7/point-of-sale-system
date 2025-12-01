/**
 * Seed Data Script for MongoDB
 * Creates initial data for development and testing
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const { Employee, Item, Rental, Coupon, User } = require('../models');

async function seedData() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    console.log(`✓ Database: ${mongoose.connection.name}\n`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Employee.deleteMany({});
    await Item.deleteMany({});
    await Rental.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});
    console.log('✓ Existing data cleared\n');

    // Create employees
    console.log('👥 Creating employees...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const cashierPassword = await bcrypt.hash('cashier123', 10);

    await Employee.create([
      {
        employeeId: '1',
        role: 'Admin',
        firstName: 'Admin',
        lastName: 'User',
        passwordHash: adminPassword,
        isActive: true
      },
      {
        employeeId: '2',
        role: 'Cashier',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: cashierPassword,
        isActive: true
      },
      {
        employeeId: '3',
        role: 'Cashier',
        firstName: 'Jane',
        lastName: 'Smith',
        passwordHash: cashierPassword,
        isActive: true
      }
    ]);
    console.log('✓ Created 3 employees');
    console.log('  - Admin (ID: 1, Password: admin123)');
    console.log('  - Cashier (ID: 2, Password: cashier123)');
    console.log('  - Cashier (ID: 3, Password: cashier123)\n');

    // Create items
    console.log('📦 Creating items...');
    await Item.create([
      {
        itemId: '1001',
        name: 'Laptop - Dell XPS 15',
        price: 999.99,
        quantity: 10,
        category: 'Electronics',
        isActive: true
      },
      {
        itemId: '1002',
        name: 'Wireless Mouse',
        price: 29.99,
        quantity: 50,
        category: 'Accessories',
        isActive: true
      },
      {
        itemId: '1003',
        name: 'Mechanical Keyboard',
        price: 79.99,
        quantity: 30,
        category: 'Accessories',
        isActive: true
      },
      {
        itemId: '1004',
        name: '27" Monitor',
        price: 299.99,
        quantity: 15,
        category: 'Electronics',
        isActive: true
      },
      {
        itemId: '1005',
        name: 'USB-C Hub',
        price: 49.99,
        quantity: 25,
        category: 'Accessories',
        isActive: true
      },
      {
        itemId: '1006',
        name: 'Webcam HD',
        price: 89.99,
        quantity: 20,
        category: 'Electronics',
        isActive: true
      },
      {
        itemId: '1007',
        name: 'Headphones',
        price: 149.99,
        quantity: 35,
        category: 'Audio',
        isActive: true
      },
      {
        itemId: '1008',
        name: 'External SSD 1TB',
        price: 129.99,
        quantity: 18,
        category: 'Storage',
        isActive: true
      },
      {
        itemId: '1009',
        name: 'Laptop Stand',
        price: 39.99,
        quantity: 40,
        category: 'Accessories',
        isActive: true
      },
      {
        itemId: '1010',
        name: 'Cable Organizer',
        price: 14.99,
        quantity: 100,
        category: 'Accessories',
        isActive: true
      }
    ]);
    console.log('✓ Created 10 items\n');

    // Create rentals
    console.log('🎬 Creating rental items...');
    await Rental.create([
      {
        rentalId: '2001',
        name: 'Projector - 4K',
        price: 50.00,
        quantity: 5,
        category: 'Equipment',
        isActive: true
      },
      {
        rentalId: '2002',
        name: 'DSLR Camera',
        price: 75.00,
        quantity: 3,
        category: 'Equipment',
        isActive: true
      },
      {
        rentalId: '2003',
        name: 'Microphone Set',
        price: 35.00,
        quantity: 8,
        category: 'Audio',
        isActive: true
      },
      {
        rentalId: '2004',
        name: 'Portable Speaker',
        price: 25.00,
        quantity: 10,
        category: 'Audio',
        isActive: true
      },
      {
        rentalId: '2005',
        name: 'Tripod Stand',
        price: 15.00,
        quantity: 12,
        category: 'Equipment',
        isActive: true
      }
    ]);
    console.log('✓ Created 5 rental items\n');

    // Create coupons
    console.log('🎟️  Creating coupons...');
    await Coupon.create([
      {
        couponCode: 'SAVE10',
        discountPercent: 10,
        expiryDate: new Date('2025-12-31'),
        maxUsage: 100,
        usageCount: 0,
        isActive: true
      },
      {
        couponCode: 'SAVE20',
        discountPercent: 20,
        expiryDate: new Date('2025-12-31'),
        maxUsage: 50,
        usageCount: 0,
        isActive: true
      },
      {
        couponCode: 'WELCOME15',
        discountPercent: 15,
        expiryDate: new Date('2025-06-30'),
        maxUsage: 200,
        usageCount: 0,
        isActive: true
      },
      {
        couponCode: 'HOLIDAY25',
        discountPercent: 25,
        expiryDate: new Date('2025-01-31'),
        maxUsage: 30,
        usageCount: 0,
        isActive: true
      }
    ]);
    console.log('✓ Created 4 coupons');
    console.log('  - SAVE10 (10% off)');
    console.log('  - SAVE20 (20% off)');
    console.log('  - WELCOME15 (15% off)');
    console.log('  - HOLIDAY25 (25% off)\n');

    // Create sample users
    console.log('👤 Creating sample users...');
    await User.create([
      { phoneNumber: '5551234567' },
      { phoneNumber: '5559876543' },
      { phoneNumber: '5555555555' }
    ]);
    console.log('✓ Created 3 sample users\n');

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`  • Employees: ${await Employee.countDocuments()}`);
    console.log(`  • Items: ${await Item.countDocuments()}`);
    console.log(`  • Rentals: ${await Rental.countDocuments()}`);
    console.log(`  • Coupons: ${await Coupon.countDocuments()}`);
    console.log(`  • Users: ${await User.countDocuments()}`);
    console.log('\n🔐 Login Credentials:');
    console.log('  Employee ID: 1');
    console.log('  Password: admin123');
    console.log('\n🚀 Ready to start the application!');
    console.log('  Run: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run seed function
seedData();
