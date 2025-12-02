# Admin Tests

## Prerequisites
- Backend server running on http://localhost:5000
- Admin account set up (see SETUP_GUIDE.md)

## Test Credentials
- **Employee ID**: 110001
- **Password**: admin123
- **Role**: Admin
- **Name**: Harry Larry

---

## Test 1: Admin Authentication

### Test 1.1: Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"employeeId\":\"110001\",\"password\":\"admin123\"}"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "employeeId": "110001",
      "firstName": "Harry",
      "lastName": "Larry",
      "role": "Admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for all subsequent tests!**

### Test 1.2: Login with Wrong Password (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"employeeId\":\"110001\",\"password\":\"wrongpass\"}"
```

**Expected Result:** Error - "Invalid credentials"

---

## Test 2: Inventory Management

**Note:** Replace `YOUR_ADMIN_TOKEN` with the token from Test 1.1

### Test 2.1: Get All Items
```bash
curl -X GET http://localhost:5000/api/inventory ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** List of all inventory items

### Test 2.2: Get Specific Item
```bash
curl -X GET http://localhost:5000/api/inventory/1000 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Details of item 1000 (Potato)

### Test 2.3: Add New Item
```bash
curl -X POST http://localhost:5000/api/inventory ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"itemId\":\"3000\",\"name\":\"Orange Juice\",\"price\":3.99,\"quantity\":50,\"category\":\"Beverages\"}"
```

**Expected Result:** Success with new item details

### Test 2.4: Update Item
```bash
curl -X PUT http://localhost:5000/api/inventory/3000 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Fresh Orange Juice\",\"price\":4.49,\"quantity\":75}"
```

**Expected Result:** Success with updated item details

### Test 2.5: Delete Item
```bash
curl -X DELETE http://localhost:5000/api/inventory/3000 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Success message

---

## Test 3: Rental Management

### Test 3.1: Get All Rentals
```bash
curl -X GET http://localhost:5000/api/rentals ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** List of all rentals

### Test 3.2: Add New Rental
```bash
curl -X POST http://localhost:5000/api/rentals ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"rentalId\":\"3000\",\"name\":\"The Great Gatsby\",\"rentalPrice\":28.00,\"totalQuantity\":30,\"availableQuantity\":30,\"category\":\"Books\"}"
```

**Expected Result:** Success with new rental details

### Test 3.3: Update Rental
```bash
curl -X PUT http://localhost:5000/api/rentals/3000 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"The Great Gatsby - Classic Edition\",\"rentalPrice\":32.00,\"totalQuantity\":40,\"availableQuantity\":40}"
```

**Expected Result:** Success with updated rental details

### Test 3.4: Delete Rental
```bash
curl -X DELETE http://localhost:5000/api/rentals/3000 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Success message

---

## Test 4: Sales Operations

### Test 4.1: Create Sale
```bash
curl -X POST http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":10},{\"itemId\":\"1001\",\"quantity\":5}]}"
```

**Expected Result:** Sale details with total, tax, etc.

### Test 4.2: Create Sale with Coupon
```bash
curl -X POST http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"itemId\":\"1002\",\"quantity\":3}],\"couponCode\":\"C001\"}"
```

**Expected Result:** Sale with discount applied

### Test 4.3: Get All Sales
```bash
curl -X GET http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** List of all sales

### Test 4.4: Get Specific Sale
```bash
curl -X GET http://localhost:5000/api/sales/1 ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Details of sale #1

### Test 4.5: Process Return
```bash
curl -X POST http://localhost:5000/api/sales/returns ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"saleId\":1,\"itemId\":\"1000\",\"quantity\":2,\"reason\":\"Customer changed mind\"}"
```

**Expected Result:** Return processed successfully

---

## Test 5: Reports

### Test 5.1: Sales Report
```bash
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2024-01-01&endDate=2024-12-31" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Sales summary for date range

### Test 5.2: Inventory Report
```bash
curl -X GET http://localhost:5000/api/reports/inventory ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Current inventory status

### Test 5.3: Rental Report
```bash
curl -X GET http://localhost:5000/api/reports/rentals ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:** Rental statistics

---

## PowerShell Commands (Windows)

### Login and Save Token
```powershell
$loginBody = @{
    employeeId = "110001"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody

$adminToken = $response.data.token
Write-Host "Admin token saved: $adminToken"
```

### Add Item
```powershell
$itemBody = @{
    itemId = "3000"
    name = "Orange Juice"
    price = 3.99
    quantity = 50
    category = "Beverages"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/inventory" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
  } `
  -Body $itemBody
```

### Create Sale
```powershell
$saleBody = @{
    items = @(
        @{ itemId = "1000"; quantity = 10 },
        @{ itemId = "1001"; quantity = 5 }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:5000/api/sales" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
  } `
  -Body $saleBody
```

---

## Test Summary Checklist

- [ ] Admin can login successfully
- [ ] Admin can view all inventory items
- [ ] Admin can add new items
- [ ] Admin can update items
- [ ] Admin can delete items
- [ ] Admin can manage rentals (add, update, delete)
- [ ] Admin can create sales
- [ ] Admin can apply coupons to sales
- [ ] Admin can view all sales
- [ ] Admin can process returns
- [ ] Admin can generate sales reports
- [ ] Admin can generate inventory reports
- [ ] Admin can generate rental reports

---

## Notes
- Admin has full access to all system features
- Token expires after 8 hours
- All prices are in USD with 2 decimal places
- Sales automatically calculate tax (check constants.js for rate)
