@echo off
REM Quick Test Script for POS System
REM This script runs basic tests for all user types

echo ========================================
echo POS System - Quick Test Suite
echo ========================================
echo.

REM Set base URL
set BASE_URL=http://localhost:5000

echo [1/6] Testing User Registration...
curl -X POST %BASE_URL%/api/auth/register -H "Content-Type: application/json" -d "{\"userId\":\"testuser\",\"password\":\"test123\",\"phoneNumber\":\"5551234567\"}"
echo.
echo.

echo [2/6] Testing User Login...
curl -X POST %BASE_URL%/api/auth/user/login -H "Content-Type: application/json" -d "{\"userId\":\"testuser\",\"password\":\"test123\"}"
echo.
echo.

echo [3/6] Testing Admin Login...
curl -X POST %BASE_URL%/api/auth/login -H "Content-Type: application/json" -d "{\"employeeId\":\"110001\",\"password\":\"admin123\"}"
echo.
echo.

echo [4/6] Testing Cashier Login...
curl -X POST %BASE_URL%/api/auth/login -H "Content-Type: application/json" -d "{\"employeeId\":\"110002\",\"password\":\"cashier123\"}"
echo.
echo.

echo [5/6] Testing Get Rentals (No Auth)...
curl -X GET %BASE_URL%/api/rentals
echo.
echo.

echo [6/6] Testing Get Inventory (Requires Auth - may fail)...
curl -X GET %BASE_URL%/api/inventory
echo.
echo.

echo ========================================
echo Test Suite Complete!
echo ========================================
echo.
echo NOTE: Tests 5 and 6 may fail if authentication is required.
echo For full testing, use the individual test files in tests/ directory.
echo.
pause
