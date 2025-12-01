# Full Stack Application

A modern full-stack web application with a React frontend and Express.js backend connected to MongoDB.

## Project Structure

```
├── backend/          # Express.js API server
├── frontend/         # React application
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas connection string)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadMaaz7/point-of-sale-system
cd point-of-sale-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (see `.env.example`):

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string and desired port.

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend will run on `http://localhost:5000` (or your configured PORT).

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`.

## Environment Variables

### Backend (.env)

See `.env.example` for the template. Required variables:

- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

### Frontend

No environment variables required for basic setup. Add a `.env` file if needed for API configuration.

## Available Scripts

### Backend

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Building for Production

### Backend

```bash
cd backend
npm install --production
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

## Technologies Used

### Backend

- Express.js - Web framework
- Mongoose - MongoDB ODM
- CORS - Cross-origin resource sharing
- dotenv - Environment variable management

### Frontend

- React 19 - UI library
- Vite - Build tool
- Axios - HTTP client
- ESLint - Code linting

## Troubleshooting

- **MongoDB Connection Error**: Verify your `MONGO_URI` in `.env` is correct
- **Port Already in Use**: Change the `PORT` in `.env` or kill the process using the port
- **CORS Issues**: Ensure backend CORS is properly configured for your frontend URL
- **Module Not Found**: Run `npm install` in both backend and frontend directories

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
