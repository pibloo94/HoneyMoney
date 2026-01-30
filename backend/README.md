# HoneyMoney Backend API

Backend API for HoneyMoney application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **JWT Authentication** - Secure user authentication with bcrypt password hashing
- **Express & Node.js** - Robust and fast runtime
- **MongoDB & Mongoose** - Flexible document-oriented database with schema validation
- **Project-based Tracking** - All data is organized into projects
- **Custom Middleware** - Centralized error handling and request logging
- **Testing Suite** - Comprehensive integration tests with Vitest and Supertest
- **Auto Admin Seeding** - Automatic admin user creation on first run

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account (if you don't have one)
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/honeymoney?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ADMIN_EMAIL=admin@honeymoney.com
ADMIN_PASSWORD=admin123
```

Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and the cluster URL with your actual MongoDB Atlas credentials.

### 4. Run the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

### 5. Admin User

An admin user is created automatically on first run:

- **Email**: `admin@honeymoney.com` (or from `ADMIN_EMAIL`)
- **Password**: `admin123` (or from `ADMIN_PASSWORD`)

> ⚠️ **Important**: Change the admin password after first login!

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Get current user (requires auth)

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/bulk` - Bulk create transactions

### Health Check

- `GET /health` - Check if API is running

> 📖 **Full API Documentation**: See [API.md](../docs/API.md) for complete endpoint details

---

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Test the API manually:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok", "message": "HoneyMoney API is running" }
```

---

## Documentation

- 📖 [Authentication Guide](../docs/AUTHENTICATION.md) - Complete authentication documentation
- 🔌 [API Reference](../docs/API.md) - Full API endpoint documentation
- 🚀 [Deployment Guide](../docs/DEPLOYMENT.md) - Deploy to production
- 🏗️ [Architecture Overview](../docs/ARCHITECTURE.md) - System architecture
- 🧪 [Testing Guide](../TESTING.md) - Testing documentation

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── seed-admin.ts    # Admin user seeding
│   ├── server-app.ts    # Express app setup
│   └── server.ts        # Entry point
├── __tests__/           # Integration tests
└── dist/                # Compiled JavaScript
```

---

## Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
