# HoneyMoney Backend API

Backend API for HoneyMoney application built with Node.js, Express, TypeScript, and MongoDB.

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

Edit `.env` and add your MongoDB connection string:

```env
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/honeymoney?retryWrites=true&w=majority
NODE_ENV=development
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

## API Endpoints

### Features

- **Express & Node.js**: Robust and fast runtime.
- **MongoDB & Mongoose**: Flexible document-oriented database with schema validation.
- **Project-based Tracking**: All data is organized into projects.
- **Custom Middleware**: Centralized error handling and request logging.
- **Testing Suite**: Comprehensive integration tests with Vitest and Supertest.

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

### Health Check

- `GET /health` - Check if API is running

## Testing

Test the API with:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok", "message": "HoneyMoney API is running" }
```
