# Test Suite Documentation

## Overview
This directory contains comprehensive test suites for the POS System, organized by user role.

## Test Files

### 1. `user-tests.md`
Tests for customer/user operations:
- User registration
- User login
- Browse rentals
- User profile access

**Target Role:** Customers/Users  
**Authentication:** User credentials (userId + password)

### 2. `admin-tests.md`
Tests for administrator operations:
- Full inventory management (CRUD)
- Rental management (CRUD)
- Sales operations
- Returns processing
- All reports access

**Target Role:** Admin  
**Credentials:** employeeId: 110001, password: admin123

### 3. `cashier-tests.md`
Tests for cashier operations:
- View inventory (read-only)
- Create sales
- Process returns
- View rentals
- Basic reports

**Target Role:** Cashier  
**Credentials:** employeeId: 110002, password: cashier123

## Prerequisites

1. **Database Setup**
   ```bash
   mysql -u root -p
   SOURCE E:/sre_proj/point-of-sale-system/backend/config/schema.sql;
   ```

2. **Set Employee Passwords**
   ```bash
   cd backend
   node scripts/generatePasswordHash.js admin123
   node scripts/generatePasswordHash.js cashier123
   ```
   Then update the database with generated hashes.

3. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

4. **Create Test Users**
   See `SETUP_GUIDE.md` for user creation commands.

## Running Tests

### Option 1: Manual Testing (Recommended)
Open the appropriate test file and run commands one by one:
- For user tests: `tests/user-tests.md`
- For admin tests: `tests/admin-tests.md`
- For cashier tests: `tests/cashier-tests.md`

### Option 2: Using PowerShell
Each test file includes PowerShell equivalents for Windows users.

### Option 3: Using Postman
Import the commands into Postman for a GUI testing experience.

## Test Execution Order

### First Time Setup
1. Run database setup (see SETUP_GUIDE.md)
2. Generate and set employee passwords
3. Start the server
4. Run user registration tests
5. Run employee login tests

### Regular Testing
1. **User Tests** - Test customer-facing features
2. **Cashier Tests** - Test point-of-sale operations
3. **Admin Tests** - Test administrative features

## Expected Results

Each test includes:
- Command to execute
- Expected HTTP status code
- Expected response structure
- Error scenarios

## Token Management

All authenticated requests require a JWT token:
1. Login to get token
2. Save token from response
3. Use token in Authorization header: `Bearer YOUR_TOKEN`
4. Tokens expire after 8 hours

## Common Issues

### "Invalid credentials"
- Check password hashes are set correctly in database
- Verify employeeId/userId is correct
- Ensure password matches

### "Authorization required"
- Token missing or expired
- Login again to get new token

### "Item not found"
- Verify item exists in database
- Check itemId is correct

### Connection refused
- Ensure backend server is running
- Check port 5000 is not in use

## Test Data

### Pre-loaded Items
- 1000: Potato ($1.00)
- 1001: PlasticCup ($0.50)
- 1002: SkirtSteak ($15.00)
- 1003: PotatoChips ($1.20)

### Pre-loaded Rentals
- 1000: TheoryOfEverything ($30.00)
- 1001: AdventuresOfTomSawyer ($40.50)
- 1002: PrideAndPrejudice ($30.00)
- 1003: MarleyAndMe ($35.00)
- 1004: TheMummy ($30.00)
- 1005: TheInterview ($20.00)

### Pre-loaded Coupons
- C001: 10% off (min purchase $20)
- C002: $5 off (min purchase $10)

## Reporting Issues

When reporting test failures, include:
1. Test file and test number
2. Command executed
3. Expected result
4. Actual result
5. Server logs (if available)

## Additional Resources

- `SETUP_GUIDE.md` - Complete setup instructions
- `COMPLETE_TEST_COMMANDS.md` - All commands in one file
- `USER_REGISTRATION_GUIDE.md` - User registration details
- `USER_AUTH_IMPLEMENTATION.md` - Technical implementation details
