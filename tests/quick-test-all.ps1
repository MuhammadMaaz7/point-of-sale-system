# Quick Test Script for POS System (PowerShell)
# This script runs basic tests for all user types

$baseUrl = "http://localhost:5000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "POS System - Quick Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------
# Test 1: User Registration
# -----------------------------
Write-Host "[1/6] Testing User Registration..." -ForegroundColor Yellow
try {
    $body = @{
        userId = "testuser"
        password = "test123"
        phoneNumber = "5551234567"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body

    Write-Host "✓ User Registration: SUCCESS" -ForegroundColor Green
    Write-Host "User ID: $($response.data.user.userId)" -ForegroundColor Gray
} catch {
    Write-Host "✗ User Registration: FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# -----------------------------
# Test 2: User Login
# -----------------------------
Write-Host "[2/6] Testing User Login..." -ForegroundColor Yellow
try {
    $body = @{
        userId = "testuser"
        password = "test123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/user/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body

    $userToken = $response.data.token
    Write-Host "✓ User Login: SUCCESS" -ForegroundColor Green
    Write-Host "Token: $($userToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ User Login: FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# -----------------------------
# Test 3: Admin Login
# -----------------------------
Write-Host "[3/6] Testing Admin Login..." -ForegroundColor Yellow
try {
    $body = @{
        employeeId = "110005"
        password = "admin123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body

    $adminToken = $response.data.token
    Write-Host "✓ Admin Login: SUCCESS" -ForegroundColor Green
    Write-Host "Employee: $($response.data.employee.firstName) $($response.data.employee.lastName)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Admin Login: FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# -----------------------------
# Test 4: Cashier Login
# -----------------------------
Write-Host "[4/6] Testing Cashier Login..." -ForegroundColor Yellow
try {
    $body = @{
        employeeId = "110003"
        password = "cashier123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body

    $cashierToken = $response.data.token
    Write-Host "✓ Cashier Login: SUCCESS" -ForegroundColor Green
    Write-Host "Employee: $($response.data.employee.firstName) $($response.data.employee.lastName)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Cashier Login: FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# -----------------------------
# Test 5: Get Rentals (No Auth)
# -----------------------------
Write-Host "[5/6] Testing Get Rentals (No Auth)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/rentals" -Method GET
    Write-Host "✓ Get Rentals: SUCCESS" -ForegroundColor Green
    Write-Host "Found $($response.data.Count) rentals" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get Rentals: FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# -----------------------------
# Test 6: Get Inventory (With Admin Token)
# -----------------------------
Write-Host "[6/6] Testing Get Inventory (With Admin Token)..." -ForegroundColor Yellow

if ($adminToken) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/inventory/items" `
            -Method GET `
            -Headers @{"Authorization"="Bearer $adminToken"}
        Write-Host "✓ Get Inventory: SUCCESS" -ForegroundColor Green
        Write-Host "Found $($response.data.Count) items" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Get Inventory: FAILED" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
} else {
    Write-Host "⚠ Get Inventory: SKIPPED (No admin token)" -ForegroundColor Yellow
}
Write-Host ""

# -----------------------------
# Test Suite Complete
# -----------------------------
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Tokens saved in variables:" -ForegroundColor White
if ($userToken) { Write-Host "  `$userToken - User authentication token" -ForegroundColor Gray }
if ($adminToken) { Write-Host "  `$adminToken - Admin authentication token" -ForegroundColor Gray }
if ($cashierToken) { Write-Host "  `$cashierToken - Cashier authentication token" -ForegroundColor Gray }
Write-Host ""

Write-Host "For detailed testing, see test files in tests/ directory" -ForegroundColor White
