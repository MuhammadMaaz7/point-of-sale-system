-- Point of Sale Database Schema
-- Eliminates data smells with proper normalization and constraints

CREATE DATABASE IF NOT EXISTS pos_db;
USE pos_db;

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  employeeId VARCHAR(10) PRIMARY KEY,
  role ENUM('Admin', 'Cashier') NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_active (isActive)
);

-- Users table (customers who rent)
CREATE TABLE IF NOT EXISTS users (
  phoneNumber VARCHAR(20) PRIMARY KEY,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table (products for sale)
CREATE TABLE IF NOT EXISTS items (
  itemId VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 0,
  category VARCHAR(50) DEFAULT 'General',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (isActive)
);

-- Rentals table (items available for rent)
CREATE TABLE IF NOT EXISTS rentals (
  rentalId VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rentalPrice DECIMAL(10,2) NOT NULL,
  totalQuantity INT NOT NULL,
  availableQuantity INT NOT NULL,
  category VARCHAR(50) DEFAULT 'General',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (isActive)
);

-- User Rentals junction table
CREATE TABLE IF NOT EXISTS user_rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(20) NOT NULL,
  rentalId VARCHAR(10) NOT NULL,
  rentalDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  dueDate DATETIME NOT NULL,
  returnDate DATETIME NULL,
  isReturned BOOLEAN DEFAULT FALSE,
  lateFee DECIMAL(10,2) DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (phoneNumber) REFERENCES users(phoneNumber),
  FOREIGN KEY (rentalId) REFERENCES rentals(rentalId),
  INDEX idx_phone (phoneNumber),
  INDEX idx_rental (rentalId),
  INDEX idx_returned (isReturned)
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  saleId INT AUTO_INCREMENT PRIMARY KEY,
  employeeId VARCHAR(10) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  taxAmount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  couponCode VARCHAR(20) NULL,
  discountAmount DECIMAL(10,2) DEFAULT 0,
  saleDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(employeeId),
  INDEX idx_employee (employeeId),
  INDEX idx_date (saleDate)
);

-- Sale Items table
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  saleId INT NOT NULL,
  itemId VARCHAR(10) NOT NULL,
  itemName VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  lineTotal DECIMAL(10,2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saleId) REFERENCES sales(saleId) ON DELETE CASCADE,
  FOREIGN KEY (itemId) REFERENCES items(itemId),
  INDEX idx_sale (saleId),
  INDEX idx_item (itemId)
);

-- Returns table
CREATE TABLE IF NOT EXISTS returns (
  returnId INT AUTO_INCREMENT PRIMARY KEY,
  saleId INT NULL,
  itemId VARCHAR(10) NOT NULL,
  itemName VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  refundAmount DECIMAL(10,2) NOT NULL,
  reason TEXT NULL,
  employeeId VARCHAR(10) NOT NULL,
  returnDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saleId) REFERENCES sales(saleId),
  FOREIGN KEY (itemId) REFERENCES items(itemId),
  FOREIGN KEY (employeeId) REFERENCES employees(employeeId),
  INDEX idx_sale (saleId),
  INDEX idx_employee (employeeId),
  INDEX idx_date (returnDate)
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  couponCode VARCHAR(20) PRIMARY KEY,
  discountType ENUM('percentage', 'fixed') NOT NULL,
  discountValue DECIMAL(10,2) NOT NULL,
  minPurchaseAmount DECIMAL(10,2) DEFAULT 0,
  maxDiscountAmount DECIMAL(10,2) NULL,
  expirationDate DATETIME NULL,
  usageLimit INT DEFAULT 0,
  usageCount INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (isActive)
);

-- Employee Logs table
CREATE TABLE IF NOT EXISTS employee_logs (
  logId INT AUTO_INCREMENT PRIMARY KEY,
  employeeId VARCHAR(10) NOT NULL,
  action VARCHAR(50) NOT NULL,
  details TEXT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(employeeId),
  INDEX idx_employee (employeeId),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp)
);

-- Insert sample data
INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) VALUES
('110001', 'Admin', 'Harry', 'Larry', '$2a$10$YourHashedPasswordHere'),
('110002', 'Cashier', 'Debra', 'Cooper', '$2a$10$YourHashedPasswordHere');

INSERT INTO items (itemId, name, price, quantity, category) VALUES
('1000', 'Potato', 1.00, 249, 'Produce'),
('1001', 'PlasticCup', 0.50, 376, 'Supplies'),
('1002', 'SkirtSteak', 15.00, 1055, 'Meat'),
('1003', 'PotatoChips', 1.20, 16, 'Snacks');

INSERT INTO rentals (rentalId, name, rentalPrice, totalQuantity, availableQuantity, category) VALUES
('1000', 'TheoryOfEverything', 30.00, 249, 249, 'Books'),
('1001', 'AdventuresOfTomSawyer', 40.50, 391, 391, 'Books'),
('1002', 'PrideAndPrejudice', 30.00, 995, 995, 'Books'),
('1003', 'MarleyAndMe', 35.00, 199, 199, 'Books'),
('1004', 'TheMummy', 30.00, 98, 98, 'Movies'),
('1005', 'TheInterview', 20.00, 200, 200, 'Movies');

INSERT INTO coupons (couponCode, discountType, discountValue, minPurchaseAmount) VALUES
('C001', 'percentage', 10.00, 20.00),
('C002', 'fixed', 5.00, 10.00);
