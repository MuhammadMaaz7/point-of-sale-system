# Complete API Test Suite - cURL Commands

All features are now accessible via the API endpoints below.

first run:
cd backend
npm run dev


## User / Customer Tests

### User Registration
```bash
# Register with phone number
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"userId\":\"testuser1\",\"password\":\"test123\",\"phoneNumber\":\"5551112222\"}"

# Register without phone number
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"userId\":\"testuser2\",\"password\":\"test456\"}"

# Register duplicate user (should fail)
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"userId\":\"testuser1\",\"password\":\"different\"}"

# Register without password (should fail)
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"userId\":\"testuser3\"}"
```

### User Login
```bash
# Login successfully
curl -X POST http://localhost:5000/api/auth/user/login -H "Content-Type: application/json" -d "{\"userId\":\"customer1\",\"password\":\"pass123\"}"

# Login with wrong password (should fail)
curl -X POST http://localhost:5000/api/auth/user/login -H "Content-Type: application/json" -d "{\"userId\":\"customer1\",\"password\":\"wrongpass\"}"

# Login non-existent user (should fail)
curl -X POST http://localhost:5000/api/auth/user/login -H "Content-Type: application/json" -d "{\"userId\":\"nonexistent\",\"password\":\"pass123\"}"
```

### Browse Rentals (Public)
```bash
# Get all rentals
curl -X GET http://localhost:5000/api/rentals

# Get specific rental
curl -X GET http://localhost:5000/api/rentals/1000
```

### Get Current User Info (Authenticated)
```bash
curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Admin Tests

### Admin Login
```bash
# Login successfully
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"employeeId\":\"110001\",\"password\":\"admin123\"}"

# Login with wrong password (should fail)
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"employeeId\":\"110001\",\"password\":\"wrongpass\"}"
```

### Inventory Management
```bash
# Get all inventory items
curl -X GET http://localhost:5000/api/inventory -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get specific item
curl -X GET http://localhost:5000/api/inventory/1000 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Add new item
curl -X POST http://localhost:5000/api/inventory -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"itemId\":\"3000\",\"name\":\"Orange Juice\",\"price\":3.99,\"quantity\":50,\"category\":\"Beverages\"}"

# Update item
curl -X PUT http://localhost:5000/api/inventory/3000 -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"Fresh Orange Juice\",\"price\":4.49,\"quantity\":75}"

# Delete item
curl -X DELETE http://localhost:5000/api/inventory/3000 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Rental Management
```bash
# Get all rentals
curl -X GET http://localhost:5000/api/rentals -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Add rental
curl -X POST http://localhost:5000/api/rentals -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"rentalId\":\"3000\",\"name\":\"The Great Gatsby\",\"rentalPrice\":28.00,\"totalQuantity\":30,\"availableQuantity\":30,\"category\":\"Books\"}"

# Update rental
curl -X PUT http://localhost:5000/api/rentals/3000 -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"The Great Gatsby - Classic Edition\",\"rentalPrice\":32.00,\"totalQuantity\":40,\"availableQuantity\":40}"

# Delete rental
curl -X DELETE http://localhost:5000/api/rentals/3000 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Sales Management
```bash
# Create sale
curl -X POST http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":10},{\"itemId\":\"1001\",\"quantity\":5}]}"

# Create sale with coupon
curl -X POST http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"items\":[{\"itemId\":\"1002\",\"quantity\":3}],\"couponCode\":\"C001\"}"

# Get all sales
curl -X GET http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get specific sale
curl -X GET http://localhost:5000/api/sales/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Process return
curl -X POST http://localhost:5000/api/sales/returns -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"saleId\":1,\"itemId\":\"1000\",\"quantity\":2,\"reason\":\"Customer changed mind\"}"
```

### Reports
```bash
# Sales report
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2024-01-01&endDate=2024-12-31" -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Inventory report
curl -X GET http://localhost:5000/api/reports/inventory -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Rental report
curl -X GET http://localhost:5000/api/reports/rentals -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Cashier Tests

### Cashier Login
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"employeeId\":\"110002\",\"password\":\"cashier123\"}"
```

### Inventory (Read-Only)
```bash
# Get all inventory items
curl -X GET http://localhost:5000/api/inventory -H "Authorization: Bearer YOUR_CASHIER_TOKEN"

# Get specific item
curl -X GET http://localhost:5000/api/inventory/1000 -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

### Sales Operations
```bash
# Create simple sale
curl -X POST http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_CASHIER_TOKEN" -H "Content-Type: application/json" -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":5}]}"

# Create sale with multiple items
curl -X POST http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_CASHIER_TOKEN" -H "Content-Type: application/json" -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":10},{\"itemId\":\"1001\",\"quantity\":20},{\"itemId\":\"1003\",\"quantity\":5}]}"

# Create sale with coupon
curl -X POST http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_CASHIER_TOKEN" -H "Content-Type: application/json" -d "{\"items\":[{\"itemId\":\"1002\",\"quantity\":2}],\"couponCode\":\"C001\"}"

# Get all sales
curl -X GET http://localhost:5000/api/sales -H "Authorization: Bearer YOUR_CASHIER_TOKEN"

# Get specific sale
curl -X GET http://localhost:5000/api/sales/1 -H "Authorization: Bearer YOUR_CASHIER_TOKEN"

# Process return
curl -X POST http://localhost:5000/api/sales/returns -H "Authorization: Bearer YOUR_CASHIER_TOKEN" -H "Content-Type: application/json" -d "{\"saleId\":1,\"itemId\":\"1000\",\"quantity\":2,\"reason\":\"Defective product\"}"
```

### Rentals (Read-Only)
```bash
# Get all rentals
curl -X GET http://localhost:5000/api/rentals -H "Authorization: Bearer YOUR_CASHIER_TOKEN"

# Get specific rental
curl -X GET http://localhost:5000/api/rentals/1000 -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

### Reports (Cashier Access)
```bash
# Sales report
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2024-01-01&endDate=2024-12-31" -H "Authorization: Bearer YOUR_CASHIER_TOKEN"

# Inventory report
curl -X GET http://localhost:5000/api/reports/inventory -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

---

## Notes

1. Replace `YOUR_TOKEN`, `YOUR_ADMIN_TOKEN`, or `YOUR_CASHIER_TOKEN` with the actual JWT token received from login
2. All endpoints return JSON responses with `success` and `data` fields
3. Error responses include an `error` field with the error message
4. Dates should be in ISO format (YYYY-MM-DD)
5. Public endpoints (browse rentals) don't require authentication
6. Admin-only endpoints will return 403 Forbidden for non-admin users
