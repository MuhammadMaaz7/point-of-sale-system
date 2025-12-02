# Point of Sale System - Setup Guide

Complete guide to set up and run the POS system with MySQL database.

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

---

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd point-of-sale-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: MySQL Database Setup

### 2.1 Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS pos_db;
```

### 2.2 Run Schema

```bash
# From the backend directory
mysql -u root -p pos_db < config/schema.sql
```

Or manually run the `backend/config/schema.sql` file in MySQL Workbench.

---

## Step 3: Configure Environment Variables

### 3.1 Backend Configuration

Create `backend/.env` file:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pos_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Tax and Discount Rates
TAX_RATE=0.08
DISCOUNT_RATE=0.10
```

### 3.2 Frontend Configuration

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

---

## Step 4: Seed Database with Initial Data

This will create employees, items, rentals, and coupons.

```bash
# From the backend directory
node scripts/seedDataMySQL.js
```

**Default Credentials Created:**

| Employee ID | Role    | Password    |
|-------------|---------|-------------|
| 110001      | Admin   | admin123    |
| 110002      | Cashier | cashier123  |
| 110003      | Cashier | cashier123  |

---

## Step 5: Generate Custom Password Hashes (Optional)

If you want to set custom passwords for employees:

```bash
# From the backend directory
node scripts/generatePasswordHash.js your_password
```

This will output a bcrypt hash. Then update the database:

```sql
USE pos_db;
UPDATE employees 
SET passwordHash = 'your_generated_hash' 
WHERE employeeId = '110001';
```

---

## Step 6: Start the Application

### 6.1 Start Backend Server

```bash
# From the backend directory
npm start

# Or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 6.2 Start Frontend (Optional)

```bash
# From the frontend directory
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## Step 7: Verify Installation

### Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-12-03T...",
  "database": "MySQL",
  "environment": "development"
}
```

### Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"110001\",\"password\":\"admin123\"}"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "employee": {
      "employeeId": "110001",
      "firstName": "Admin",
      "lastName": "User",
      "role": "Admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Default Test Data

### Employees

| ID     | Role    | Name       | Password    |
|--------|---------|------------|-------------|
| 110001 | Admin   | Admin User | admin123    |
| 110002 | Cashier | John Doe   | cashier123  |
| 110003 | Cashier | Jane Smith | cashier123  |

### Items (Sample)

| ID   | Name                | Price   | Quantity | Category    |
|------|---------------------|---------|----------|-------------|
| 1001 | Laptop - Dell XPS   | $999.99 | 10       | Electronics |
| 1002 | Wireless Mouse      | $29.99  | 50       | Accessories |
| 1003 | Mechanical Keyboard | $79.99  | 30       | Accessories |
| 1004 | 27" Monitor         | $299.99 | 15       | Electronics |

### Rentals (Sample)

| ID   | Name            | Price/Day | Quantity | Category  |
|------|-----------------|-----------|----------|-----------|
| 2001 | Projector - 4K  | $50.00    | 5        | Equipment |
| 2002 | DSLR Camera     | $75.00    | 3        | Equipment |
| 2003 | Microphone Set  | $35.00    | 8        | Audio     |

### Coupons

| Code       | Discount | Min Purchase | Expiration |
|------------|----------|--------------|------------|
| SAVE10     | 10%      | $20.00       | 2025-12-31 |
| SAVE20     | 20%      | $50.00       | 2025-12-31 |
| WELCOME15  | 15%      | $0.00        | 2025-06-30 |
| HOLIDAY25  | 25%      | $100.00      | 2025-01-31 |

---

## API Testing

See `tests/CURL_API_TESTS.md` for complete API testing commands.

Quick test examples:

```bash
# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"110001\",\"password\":\"admin123\"}"

# Get all items (replace YOUR_TOKEN with actual token)
curl -X GET http://localhost:5000/api/inventory \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a sale
curl -X POST http://localhost:5000/api/sales \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"itemId\":\"1002\",\"quantity\":2}]}"
```

---

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```

2. Check credentials in `backend/.env`

3. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```

### Port Already in Use

If port 5000 is already in use, change it in `backend/.env`:
```env
PORT=5001
```

### Authentication Errors

1. Verify passwords are correctly hashed in database
2. Check JWT_SECRET is set in `.env`
3. Re-run seed script to reset passwords

### Module Not Found Errors

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
point-of-sale-system/
├── backend/
│   ├── config/          # Database config and schema
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Data models
│   ├── repositories/    # Database access layer
│   ├── routes/          # API routes
│   ├── scripts/         # Setup and utility scripts
│   ├── services/        # Business logic
│   └── server.js        # Entry point
├── frontend/
│   └── src/             # React application
└── tests/               # API test documentation
```

---

## Next Steps

1. ✅ Database is set up
2. ✅ Default users created
3. ✅ Sample data loaded
4. 🚀 Start building features or testing the API!

For complete API documentation, see:
- `tests/CURL_API_TESTS.md` - All API endpoints with examples
- `API_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random string
2. Update default passwords immediately
3. Use environment-specific `.env` files
4. Enable HTTPS
5. Implement rate limiting
6. Add input validation
7. Set up proper CORS policies

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in the console
3. Verify all environment variables are set correctly
4. Ensure MySQL service is running
