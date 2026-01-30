# Architecture Overview

Technical architecture documentation for HoneyMoney.

## System Architecture

```
┌─────────────────┐
│   Angular App   │  (Frontend - Port 4200)
│   (TypeScript)  │
└────────┬────────┘
         │ HTTP/REST
         │ JWT Auth
         ▼
┌─────────────────┐
│  Express API    │  (Backend - Port 3000)
│   (Node.js)     │
└────────┬────────┘
         │ Mongoose
         ▼
┌─────────────────┐
│  MongoDB Atlas  │  (Database)
│   (NoSQL)       │
└─────────────────┘
```

---

## Frontend Architecture

### Technology Stack

- **Framework**: Angular 21 (Standalone Components)
- **UI Library**: PrimeNG
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Testing**: Vitest

### Directory Structure

```
src/
├── app/
│   ├── core/                 # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── models/
│   │   │   ├── transaction.model.ts
│   │   │   ├── category.model.ts
│   │   │   └── project.model.ts
│   │   └── services/
│   │       ├── api.service.ts
│   │       ├── auth.service.ts
│   │       ├── transaction.service.ts
│   │       ├── category.service.ts
│   │       └── project.service.ts
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   │   ├── login.component.ts
│   │   │   └── register.component.ts
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── reports/
│   │   └── settings/
│   ├── layout/               # App shell
│   │   ├── layout.component.ts
│   │   └── layout.component.html
│   ├── app.config.ts         # App configuration
│   └── app.routes.ts         # Route definitions
├── environments/             # Environment configs
└── assets/                   # Static assets
```

### Key Patterns

**Signals for State Management**:

```typescript
currentUser = signal<User | null>(null);
isAuthenticated = signal<boolean>(false);
```

**Standalone Components**:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ...],
  templateUrl: './dashboard.component.html'
})
```

**Route Guards**:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() || router.navigate(['/login']);
};
```

---

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Testing**: Vitest + Supertest

### Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   ├── error-handler.ts
│   │   └── logger.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   ├── Category.ts
│   │   └── Transaction.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── categories.ts
│   │   └── transactions.ts
│   ├── utils/
│   │   └── async-handler.ts
│   ├── seed-admin.ts         # Admin user seeding
│   ├── server-app.ts         # Express app setup
│   └── server.ts             # Entry point
├── __tests__/                # Integration tests
└── dist/                     # Compiled JavaScript
```

### Middleware Pipeline

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Logger Middleware
  ↓
Route Handler (with asyncHandler)
  ↓
Auth Middleware (if protected)
  ↓
Business Logic
  ↓
Response / Error Handler
```

### Key Patterns

**Async Handler Wrapper**:

```typescript
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const data = await Model.find();
    res.json(data);
  }),
);
```

**Centralized Error Handling**:

```typescript
app.use(errorHandler); // Catches all errors
```

**JWT Authentication**:

```typescript
const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
```

---

## Database Schema

### User

```typescript
{
  id: string (UUID)
  email: string (unique, lowercase)
  password: string (bcrypt hashed)
  name: string
  projects: string[] (project IDs)
  createdAt: Date
  updatedAt: Date
}
```

### Project

```typescript
{
  id: string (UUID)
  name: string
  members: string[]
  description?: string
  color: string
  createdAt: Date
  updatedAt: Date
}
```

### Category

```typescript
{
  id: string(UUID);
  name: string;
  type: 'Income' | 'Expense';
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction

```typescript
{
  id: string(UUID);
  description: string;
  amount: number;
  date: Date;
  projectId: string;
  categoryId: string;
  categoryName: string;
  member: string;
  type: 'Income' | 'Expense';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates with bcrypt
   ↓
3. Generate JWT (7-day expiry)
   ↓
4. Frontend stores in localStorage
   ↓
5. HTTP Interceptor adds to all requests
   ↓
6. Auth Middleware verifies JWT
   ↓
7. Attach userId to request
```

### Password Security

- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Pre-save Hook**: Automatic hashing on User model

### Token Security

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 7 days
- **Secret**: Minimum 32 characters (from env)

---

## Performance Optimizations

### Frontend

- **Lazy Loading**: Feature modules loaded on demand
- **OnPush Change Detection**: Reduces unnecessary checks
- **Signals**: Efficient reactive state management
- **Production Build**: AOT compilation, tree-shaking, minification

### Backend

- **Async/Await**: Non-blocking I/O
- **Connection Pooling**: MongoDB connection reuse
- **Lean Queries**: `.lean()` for read-only operations
- **Indexes**: On frequently queried fields (recommended)

---

## Testing Strategy

### Frontend Tests

- **Unit Tests**: Component logic, services
- **Integration Tests**: Component + service interaction
- **Tool**: Vitest

### Backend Tests

- **Integration Tests**: API endpoints with real MongoDB
- **In-Memory DB**: mongodb-memory-server for tests
- **Tool**: Vitest + Supertest

### Test Coverage

Run tests:

```bash
# Frontend
npm test

# Backend
cd backend && npm test
```

---

## Development Workflow

1. **Feature Branch**: Create from `main`
2. **Development**: Make changes, write tests
3. **Testing**: Run `npm test` (frontend + backend)
4. **Commit**: Use conventional commits (feat, fix, docs, etc.)
5. **Push**: Push to GitHub
6. **Review**: Create PR, review code
7. **Merge**: Merge to `main`
8. **Deploy**: Automatic deployment (CI/CD)

---

## Future Enhancements

See [Production Roadmap](../docs/PRODUCTION_ROADMAP.md) for planned improvements:

- Refresh tokens
- Role-based access control (RBAC)
- Redis caching
- Rate limiting
- Structured logging (Winston/Pino)
- PWA support
- Real-time updates (WebSockets)
