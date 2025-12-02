# User/Customer Tests

## Prerequisites
- Backend server running on http://localhost:5000
- User accounts created (see SETUP_GUIDE.md)

## Test Credentials
- **User ID**: customer1
- **Password**: pass123
- **Phone**: 5551234567

---

## Test 1: User Registration

### Test 1.1: Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"testuser1\",\"password\":\"test123\",\"phoneNumber\":\"5551112222\"}"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "testuser1",
      "phoneNumber": "5551112222",
      "formattedPhone": "(555) 111-2222"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 1.2: Register User Without Phone
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"testuser2\",\"password\":\"test456\"}"
```

**Expected Result:** Success with null phoneNumber

### Test 1.3: Register Duplicate User (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"testuser1\",\"password\":\"different\"}"
```

**Expected Result:** Error - "User ID already exists"

### Test 1.4: Register Without Password (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"testuser3\"}"
```

**Expected Result:** Error - "User ID and password required"

---

## Test 2: User Login

### Test 2.1: Login with Correct Credentials
```bash
curl -X POST http://localhost:5000/api/auth/user/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"customer1\",\"password\":\"pass123\"}"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "customer1",
      "phoneNumber": "5551234567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for next tests!**

### Test 2.2: Login with Wrong Password (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/user/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"customer1\",\"password\":\"wrongpass\"}"
```

**Expected Result:** Error - "Invalid credentials"

### Test 2.3: Login with Non-existent User (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/user/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"nonexistent\",\"password\":\"pass123\"}"
```

**Expected Result:** Error - "Invalid credentials"

---

## Test 3: Browse Rentals (No Auth Required)

### Test 3.1: Get All Rentals
```bash
curl -X GET http://localhost:5000/api/rentals
```

**Expected Result:** List of available rentals

### Test 3.2: Get Specific Rental
```bash
curl -X GET http://localhost:5000/api/rentals/1000
```

**Expected Result:** Details of rental with ID 1000

---

## Test 4: User Profile (With Auth Token)

### Test 4.1: Get Current User Info
First, login and get token:
```bash
curl -X POST http://localhost:5000/api/auth/user/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"customer1\",\"password\":\"pass123\"}"
```

Then use the token:
```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Result:** User information

---

## PowerShell Commands (Windows)

### Register User
```powershell
$body = @{
    userId = "testuser1"
    password = "test123"
    phoneNumber = "5551112222"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Login and Save Token
```powershell
$loginBody = @{
    userId = "customer1"
    password = "pass123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/user/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody

$token = $response.data.token
Write-Host "Token saved: $token"
```

### Use Token
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/rentals" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

---

## Test Summary Checklist

- [ ] User can register with userId, password, and phone
- [ ] User can register without phone number
- [ ] Duplicate userId is rejected
- [ ] Missing password is rejected
- [ ] User can login with correct credentials
- [ ] Wrong password is rejected
- [ ] Non-existent user is rejected
- [ ] User can browse rentals without authentication
- [ ] User can access profile with valid token

---

## Notes
- User tokens expire after 8 hours
- Phone number must be exactly 10 digits if provided
- User ID must be unique
- No password length restrictions
