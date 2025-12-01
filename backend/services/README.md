# Service Layer Documentation

## Overview
The service layer contains all business logic for the Point of Sale system. Each service is responsible for a specific domain and follows clean architecture principles.

## Services

### AuthService
**Purpose:** Authentication and employee management

**Dependencies:**
- `employeeRepo` - Employee data access
- `employeeLogRepo` - Audit logging

**Key Methods:**
```javascript
await authService.login(employeeId, password)
await authService.addEmployee({ firstName, lastName, role, password })
await authService.updateEmployee(employeeId, updates)
await authService.deactivateEmployee(employeeId)
await authService.getAllEmployees(includeInactive)
```

**Configuration:**
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRY` - Token expiration time (default: 8h)
- `BCRYPT_SALT_ROUNDS` - Password hashing rounds (default: 10)

---

### InventoryService
**Purpose:** Inventory and rental item management

**Dependencies:**
- `itemRepo` - Item data access
- `rentalRepo` - Rental item data access

**Key Methods:**
```javascript
await inventoryService.addItem({ name, price, quantity, category })
await inventoryService.updateItem(itemId, updates)
await inventoryService.adjustItemQuantity(itemId, quantityChange)
await inventoryService.getLowStockItems(threshold)
await inventoryService.getInventoryStats()
```

**Configuration:**
- `LOW_STOCK_THRESHOLD` - Low stock alert level (default: 10)
- `CRITICAL_STOCK_THRESHOLD` - Critical stock level (default: 5)

---

### RentalService
**Purpose:** Rental transactions and returns

**Dependencies:**
- `rentalRepo` - Rental item data access
- `userRepo` - User data access
- `userRentalRepo` - User rental records
- `inventoryService` - Inventory adjustments

**Key Methods:**
```javascript
await rentalService.processRental(phoneNumber, rentalItems)
await rentalService.processReturn(phoneNumber, returnItems)
await rentalService.getOutstandingRentals(phoneNumber)
await rentalService.getRentalHistory(phoneNumber)
```

**Configuration:**
- `RENTAL_PERIOD_DAYS` - Rental duration (default: 14)
- `LATE_FEE_RATE` - Late fee percentage (default: 0.10)

---

### SaleService
**Purpose:** Sales transactions and payment processing

**Dependencies:**
- `saleRepo` - Sale data access
- `itemRepo` - Item data access
- `couponRepo` - Coupon data access
- `inventoryService` - Inventory adjustments

**Key Methods:**
```javascript
await saleService.processSale(employeeId, cartItems, paymentInfo)
await saleService.getSaleById(saleId)
await saleService.getSalesByEmployee(employeeId, startDate, endDate)
await saleService.getSaleStats(startDate, endDate)
```

**Configuration:**
- `TAX_RATE` - Sales tax rate (default: 0.06)
- `DEFAULT_DISCOUNT_PERCENT` - Default discount (default: 10)

---

### ReportService
**Purpose:** Analytics and reporting

**Dependencies:**
- `db` - Database connection

**Key Methods:**
```javascript
await reportService.getSalesReport(startDate, endDate)
await reportService.getTopSellingItems(limit)
await reportService.getEmployeePerformance(startDate, endDate)
await reportService.getRentalReport(startDate, endDate)
await reportService.getInventoryReport()
await reportService.getRevenueSummary(startDate, endDate)
```

**Configuration:**
- `DEFAULT_REPORT_LIMIT` - Default result limit (default: 100)
- `TOP_ITEMS_LIMIT` - Top items to show (default: 10)

---

### CouponService
**Purpose:** Coupon management and validation

**Dependencies:**
- `couponRepo` - Coupon data access

**Key Methods:**
```javascript
await couponService.createCoupon({ couponCode, discountPercent, expiryDate, maxUsage })
await couponService.validateCoupon(couponCode)
await couponService.updateCoupon(couponCode, updates)
await couponService.getActiveCoupons()
```

---

### UserService
**Purpose:** Customer/user management

**Dependencies:**
- `userRepo` - User data access
- `userRentalRepo` - User rental records

**Key Methods:**
```javascript
await userService.createUser(phoneNumber)
await userService.getUserByPhone(phoneNumber)
await userService.getOrCreateUser(phoneNumber)
await userService.getUserRentalHistory(phoneNumber)
await userService.getUserStats(phoneNumber)
```

---

## Usage Example

```javascript
// Import services
const {
  AuthService,
  SaleService,
  InventoryService
} = require('./services');

// Import repositories
const {
  EmployeeRepository,
  ItemRepository,
  SaleRepository
} = require('./repositories');

// Initialize repositories
const employeeRepo = new EmployeeRepository(db);
const itemRepo = new ItemRepository(db);
const saleRepo = new SaleRepository(db);

// Initialize services with dependencies
const authService = new AuthService(employeeRepo, employeeLogRepo);
const inventoryService = new InventoryService(itemRepo, rentalRepo);
const saleService = new SaleService(saleRepo, itemRepo, couponRepo, inventoryService);

// Use in controller
async function processSaleController(req, res) {
  try {
    const { employeeId, cartItems, paymentInfo } = req.body;
    const result = await saleService.processSale(employeeId, cartItems, paymentInfo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

---

## Design Principles

### 1. Single Responsibility
Each service handles one domain area (auth, sales, rentals, etc.)

### 2. Dependency Injection
Services receive dependencies via constructor, making them testable

### 3. No Direct Database Access
Services use repositories for data access, never direct SQL

### 4. Configuration Over Hard-coding
All constants are configurable via environment variables

### 5. Validation
All inputs are validated before processing

### 6. Error Handling
Services throw descriptive errors that controllers can catch

### 7. No Side Effects
Methods are predictable and don't modify unexpected state

---

## Testing

Services are designed to be easily testable with mock repositories:

```javascript
// Example test
const authService = new AuthService(mockEmployeeRepo, mockLogRepo);

test('login with valid credentials', async () => {
  mockEmployeeRepo.findById.mockResolvedValue({
    employeeId: 1,
    passwordHash: await bcrypt.hash('password123', 10),
    isActive: true
  });

  const result = await authService.login(1, 'password123');
  expect(result.token).toBeDefined();
});
```

---

## Migration from Java

This service layer replaces the following Java classes:

| Java Class | New Service |
|------------|-------------|
| Login_Interface.java | AuthService |
| EmployeeManagement.java | AuthService |
| Inventory.java | InventoryService |
| POR.java | RentalService |
| POH.java | RentalService |
| Management.java | RentalService, UserService |
| POS.java | SaleService |
| PointOfSale.java | SaleService |
| Transaction_Interface.java | ReportService |

All code and data smells from the Java implementation have been eliminated.
