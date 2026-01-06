# 🛒 Point of Sale System

A modern, full-stack Point of Sale (POS) system built with React, Node.js, Express, and MySQL. Features a beautiful, minimalist UI with smooth animations and comprehensive business management capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **Sales Management** - Process sales transactions with real-time inventory updates
- **Inventory Control** - Track products, stock levels, and categories
- **Rental Management** - Handle rental transactions with automatic late fee calculation
- **Discount Coupons** - Create and manage promotional coupons with various discount types
- **Employee Management** - Role-based access control (Admin/Cashier)
- **Employee Profiles** - Capture contact, department, position, and date of joining for every team member
- **Reports & Analytics** - Generate sales, inventory, and rental reports

### 🎨 Modern UI/UX
- **Sky Blue Theme** - Professional color palette with soft gradients
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Glass Morphism** - Modern backdrop blur effects
- **Responsive Design** - Mobile-first, works on all devices
- **Accessible** - WCAG AA compliant

### 🔐 Security
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Admin and Cashier roles with different permissions
- **Password Hashing** - Bcrypt password encryption
- **Input Validation** - Server-side and client-side validation

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Reengineered
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Configure Database**

Create a `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pos_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Rental Configuration
RENTAL_PERIOD_DAYS=14
LATE_FEE_RATE=0.10
```

5. **Initialize Database**
```bash
cd backend
# Run the schema
mysql -u root -p < config/schema.sql

# Or use the seed script
node scripts/seedDataMySQL.js
```

6. **Start the Application**

**Backend** (Terminal 1):
```bash
cd backend
npm start
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👤 Default Credentials

### Admin Account
- **Employee ID**: `110001`
- **Password**: `admin123`

### Cashier Accounts
- **Employee ID**: `110002` or `110003`
- **Password**: `cashier123`

> ⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
Reengineered/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Request handlers
│   ├── models/            # Data models
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Utility scripts
│   └── server.js          # Entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration
│   ├── public/            # Static assets
│   └── index.html         # HTML template
│
└── README.md              # This file
```

## 🎯 Key Technologies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login
- `GET /api/auth/me` - Get current user

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales/returns` - Process return

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Rentals
- `GET /api/rentals` - Get rental catalog
- `POST /api/rentals/process` - Process rental
- `POST /api/rentals/return` - Process return
- `GET /api/rentals/active` - Get active rentals

### Coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `GET /api/coupons/active` - Get active coupons
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:code` - Update coupon (Admin)
- `DELETE /api/coupons/:code` - Delete coupon (Admin)

### Employees
- `GET /api/auth/employees` - Get all employees (Admin)
- `POST /api/auth/employees` - Add employee (Admin)
- `PUT /api/auth/employees/:id` - Update employee (Admin)
- `DELETE /api/auth/employees/:id` - Deactivate employee (Admin)

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/rentals` - Rental report

## 🎨 Design System

### Colors
- **Primary**: Sky Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Animations
- **Fade In**: 300ms ease-in-out
- **Slide Up**: 300ms ease-out
- **Scale In**: 200ms ease-out
- **Hover Effects**: Lift and shadow enhancement

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Build for Production
```bash
cd frontend
npm run build  # Build optimized production bundle
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pos_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
RENTAL_PERIOD_DAYS=14
LATE_FEE_RATE=0.10
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Database Schema

### Main Tables
- **employees** - Employee accounts and roles
- **users** - Customer information (for rentals)
- **items** - Product inventory
- **rentals** - Rental catalog
- **user_rentals** - Active rental transactions
- **sales** - Sales transactions
- **sale_items** - Sale line items
- **coupons** - Discount coupons
- **returns** - Return transactions

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Run database migrations
3. Start the server: `npm start`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Recommended Hosting
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: PlanetScale, AWS RDS, DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Software Reengineering Project Team

## 🙏 Acknowledgments

- Original Java POS system
- React and Node.js communities
- Tailwind CSS team
- All contributors

## 📞 Support

For support, email support@possystem.com or open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
