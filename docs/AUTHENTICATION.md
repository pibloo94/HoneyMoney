# Authentication Guide

## Overview

HoneyMoney uses JWT (JSON Web Token) based authentication to secure the API and protect user data.

## Quick Start

### 1. Register a New Account

**Endpoint**: `POST /api/auth/register`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "projects": []
  }
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**: Same as registration

### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**:

```
Authorization: Bearer <your-jwt-token>
```

**Response**:

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "John Doe",
  "projects": ["project-id-1", "project-id-2"]
}
```

---

## Admin User

An admin user is automatically created when the backend starts for the first time.

### Default Credentials

- **Email**: `admin@honeymoney.com`
- **Password**: `admin123`

> [!WARNING]
> Change the admin password immediately after first login!

### Customizing Admin Credentials

Add to your `backend/.env`:

```bash
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=yourSecurePassword
```

---

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Expiration**: Tokens expire after 7 days
- **Protected Routes**: All dashboard routes require authentication
- **HTTP-Only Cookies**: Consider using httpOnly cookies in production instead of localStorage

---

## Frontend Integration

### Using the Auth Service

```typescript
import { AuthService } from './core/services/auth.service';

// Inject the service
authService = inject(AuthService);

// Check if user is authenticated
if (this.authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = this.authService.currentUser();

// Logout
this.authService.logout();
```

### Protecting Routes

```typescript
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
```

---

## Troubleshooting

### "Invalid or expired token"

- Your JWT token has expired (7 days)
- Solution: Login again to get a new token

### "No token provided"

- The Authorization header is missing
- Solution: Ensure the HTTP interceptor is configured in `app.config.ts`

### "User already exists"

- An account with that email already exists
- Solution: Use a different email or login with existing credentials
