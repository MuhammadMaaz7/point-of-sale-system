-- Setup Employee Passwords
-- Run this script to set up default passwords for employees
-- Default passwords: admin123 for admin, cashier123 for cashier

USE pos_db;

-- Admin password: admin123
-- Hash generated with bcrypt, 10 rounds
UPDATE employees 
SET passwordHash = '$2a$10$rOZJQqVJ5K5h5h5h5h5h5uXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX'
WHERE employeeId = '110001';

-- Cashier password: cashier123
-- Hash generated with bcrypt, 10 rounds
UPDATE employees 
SET passwordHash = '$2a$10$rOZJQqVJ5K5h5h5h5h5h5uXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX'
WHERE employeeId = '110002';

-- NOTE: The above hashes are placeholders!
-- Generate real hashes using: node backend/scripts/generatePasswordHash.js <password>
-- Then update this file with the real hashes

SELECT 'Employee passwords updated!' as message;
