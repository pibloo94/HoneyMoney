# HoneyMoney

A modern income and expense tracking application built with Angular and Node.js.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with JWT tokens
- 📊 **Project-based Tracking** - Organize transactions by projects
- 💰 **Income & Expense Management** - Track all your financial transactions
- 📈 **Reports & Analytics** - Visualize your financial data
- 👥 **Multi-member Support** - Track expenses for couples or families
- 🎨 **Modern UI** - Beautiful interface with PrimeNG and Tailwind CSS

## Project Structure

This is a full-stack application:

- **Frontend**: Angular 21 with PrimeNG and Tailwind CSS (in `/src`)
- **Backend**: Node.js + Express + MongoDB (in `/backend`)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set a secure `JWT_SECRET` (minimum 32 characters)

4. Start the backend server:

```bash
npm run dev
```

The API will run on `http://localhost:3000`

### Frontend Setup

1. Return to the root directory and install dependencies:

```bash
cd ..
npm install
```

2. Start the development server:

```bash
npm start
```

The application will run on `http://localhost:4200`

### Default Admin User

An admin user is created automatically on first run:

- **Email**: `admin@honeymoney.com`
- **Password**: `admin123`

> ⚠️ **Important**: Change the admin password after first login!

## Documentation

- 📖 [Authentication Guide](docs/AUTHENTICATION.md) - Complete authentication documentation
- 🔌 [API Reference](docs/API.md) - Full API endpoint documentation
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to production
- 🏗️ [Architecture Overview](docs/ARCHITECTURE.md) - System architecture and design patterns
- 🧪 [Testing Guide](TESTING.md) - How to run and write tests

## Development

### Running Tests

**Frontend**:

```bash
npm test
```

**Backend**:

```bash
cd backend && npm test
```

### Building for Production

**Frontend**:

```bash
npm run build
```

**Backend**:

```bash
cd backend && npm run build
```

## Technology Stack

### Frontend

- Angular 21
- PrimeNG (UI Components)
- Tailwind CSS
- TypeScript
- Vitest (Testing)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password Hashing)
- Vitest + Supertest (Testing)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
