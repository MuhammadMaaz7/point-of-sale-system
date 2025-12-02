# Cashier Tests

## Prerequisites
- Backend server running on http://localhost:5000
- Cashier account set up (see SETUP_GUIDE.md)

## Test Credentials
- **Employee ID**: 110002
- **Password**: cashier123
- **Role**: Cashier
- **Name**: Debra Cooper

---

## Test 1: Cashier Authentication

### Test 1.1: Cashier Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"employeeId\":\"110002\",\"password\":\"cashier123\"}"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "employeeId": "110002",
      "firstName": "Debra",
      "lastName": "Cooper",
      "role": "Cashier"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for all subsequent tests!**

---

## Test 2: View Inventory (Read-Only)

**Note:** Replace `YOUR_CASHIER_TOKEN` with the token from Test 1.1

### Test 2.1: Get All Items
```bash
curl -X GET http://localhost:5000/api/inventory ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** List of all inventory items

### Test 2.2: Get Specific Item
```bash
curl -X GET http://localhost:5000/api/inventory/1000 ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** Details of item 1000 (Potato)

---

## Test 3: Sales Operations (Primary Cashier Function)

### Test 3.1: Create Simple Sale
```bash
curl -X POST http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":5}]}"
```

**Expected Result:** Sale created with total, tax, etc.

### Test 3.2: Create Sale with Multiple Items
```bash
curl -X POST http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"itemId\":\"1000\",\"quantity\":10},{\"itemId\":\"1001\",\"quantity\":20},{\"itemId\":\"1003\",\"quantity\":5}]}"
```

**Expected Result:** Sale with multiple line items

### Test 3.3: Create Sale with Coupon
```bash
curl -X POST http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"itemId\":\"1002\",\"quantity\":2}],\"couponCode\":\"C001\"}"
```

**Expected Result:** Sale with discount applied

### Test 3.4: Get All Sales
```bash
curl -X GET http://localhost:5000/api/sales ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** List of all sales

### Test 3.5: Get Specific Sale
```bash
curl -X GET http://localhost:5000/api/sales/1 ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** Details of sale #1

---

## Test 4: Returns Processing

### Test 4.1: Process Return
```bash
curl -X POST http://localhost:5000/api/sales/returns ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"saleId\":1,\"itemId\":\"1000\",\"quantity\":2,\"reason\":\"Defective product\"}"
```

**Expected Result:** Return processed successfully

### Test 4.2: Process Return Without Sale ID
```bash
curl -X POST http://localhost:5000/api/sales/returns ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"itemId\":\"1001\",\"quantity\":1,\"reason\":\"No receipt\"}"
```

**Expected Result:** Return processed (if allowed by business rules)

---

## Test 5: View Rentals

### Test 5.1: Get All Rentals
```bash
curl -X GET http://localhost:5000/api/rentals ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** List of all rentals

### Test 5.2: Get Specific Rental
```bash
curl -X GET http://localhost:5000/api/rentals/1000 ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** Details of rental 1000

---

## Test 6: Reports (Limited Access)

### Test 6.1: Sales Report
```bash
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2024-01-01&endDate=2024-12-31" ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** Sales summary (may be limited compared to admin)

### Test 6.2: Inventory Report
```bash
curl -X GET http://localhost:5000/api/reports/inventory ^
  -H "Authorization: Bearer YOUR_CASHIER_TOKEN"
```

**Expected Result:** Current inventory status

---

## PowerShell Commands (Windows)

### Login and Save Token
```powershell
$loginBody = @{
    employeeId = "110002"
    password = "cashier123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody

$cashierToken = $response.data.token
Write-Host "Cashier token saved: $cashierToken"
```

### Create Sale
```powershell
$saleBody = @{
    items = @(
        @{ itemId = "1000"; quantity = 5 },
        @{ itemId = "1001"; quantity = 10 }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:5000/api/sales" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $cashierToken"
    "Content-Type" = "application/json"
  } `
  -Body $saleBody
```

### Process Return
```powershell
$returnBody = @{
    saleId = 1
    itemId = "1000"
    quantity = 2
    reason = "Customer request"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/sales/returns" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $cashierToken"
    "Content-Type" = "application/json"
  } `
  -Body $returnBody
```

---

## Test Summary Checklist

- [ ] Cashier can login successfully
- [ ] Cashier can view inventory items
- [ ] Cashier can create sales
- [ ] Cashier can create sales with multiple items
- [ ] Cashier can apply coupons to sales
- [ ] Cashier can view all sales
- [ ] Cashier can view specific sale details
- [ ] Cashier can process returns
- [ ] Cashier can view rentals
- [ ] Cashier can generate basic reports

---

## Cashier Limitations (vs Admin)

Cashiers typically CANNOT:
- Add new inventory items
- Update item prices or quantities
- Delete items
- Add/modify/delete rentals
- Manage other employees
- Access advanced reports

Cashiers CAN:
- View inventory
- Create sales
- Process returns
- View rentals
- Generate basic reports

---

## Notes
- Cashier token expires after 8 hours
- All sales are automatically associated with the logged-in cashier
- Returns must reference valid sale IDs when possible
- Coupons are validated automatically during sale creation
