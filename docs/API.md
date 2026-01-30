# API Reference

Complete API documentation for HoneyMoney backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints except `/auth/*` require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register

Create a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "name": "string (required)"
}
```

**Success Response** (201):

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "projects": []
  }
}
```

**Error Responses**:

- `400`: User already exists or validation error

---

### Login

Authenticate and receive a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response** (200):

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "projects": ["string"]
  }
}
```

**Error Responses**:

- `401`: Invalid email or password

---

### Get Current User

Get authenticated user information.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200):

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "projects": ["string"]
}
```

**Error Responses**:

- `401`: Invalid or expired token
- `404`: User not found

---

## Projects

### List All Projects

- **URL**: `/projects`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200):

```json
[
  {
    "id": "string",
    "name": "string",
    "members": ["string"],
    "description": "string",
    "color": "string",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
]
```

---

### Get Project by ID

- **URL**: `/projects/:id`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200):

```json
{
  "id": "string",
  "name": "string",
  "members": ["string"],
  "description": "string",
  "color": "string"
}
```

**Error Responses**:

- `404`: Project not found

---

### Create Project

- **URL**: `/projects`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "id": "string (required)",
  "name": "string (required)",
  "members": ["string (required)"],
  "description": "string (optional)",
  "color": "string (required)"
}
```

**Success Response** (201):

```json
{
  "id": "string",
  "name": "string",
  "members": ["string"],
  "description": "string",
  "color": "string"
}
```

---

### Update Project

- **URL**: `/projects/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body**: Same as Create Project

**Success Response** (200): Updated project object

**Error Responses**:

- `404`: Project not found
- `400`: Validation error

---

### Delete Project

- **URL**: `/projects/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response** (200):

```json
{
  "message": "Project deleted successfully"
}
```

**Error Responses**:

- `404`: Project not found

---

## Categories

### List All Categories

- **URL**: `/categories`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200):

```json
[
  {
    "id": "string",
    "name": "string",
    "type": "Income | Expense",
    "icon": "string",
    "color": "string"
  }
]
```

---

### Create Category

- **URL**: `/categories`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "id": "string (required)",
  "name": "string (required)",
  "type": "Income | Expense (required)",
  "icon": "string (required)",
  "color": "string (required)"
}
```

**Success Response** (201): Created category object

---

## Transactions

### List All Transactions

- **URL**: `/transactions`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200):

```json
[
  {
    "id": "string",
    "description": "string",
    "amount": "number",
    "date": "ISO 8601 date",
    "projectId": "string",
    "categoryId": "string",
    "categoryName": "string",
    "member": "string",
    "type": "Income | Expense"
  }
]
```

---

### Create Transaction

- **URL**: `/transactions`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "id": "string (required)",
  "description": "string (required)",
  "amount": "number (required)",
  "date": "ISO 8601 date (required)",
  "projectId": "string (required)",
  "categoryId": "string (required)",
  "categoryName": "string (required)",
  "member": "string (required)",
  "type": "Income | Expense (required)"
}
```

**Success Response** (201): Created transaction object

---

### Bulk Create Transactions

- **URL**: `/transactions/bulk`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**: Array of transaction objects

**Success Response** (201): Array of created transactions

---

## Health Check

### Check API Status

- **URL**: `/health`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200):

```json
{
  "status": "ok",
  "message": "HoneyMoney API is running"
}
```

---

## Error Responses

All endpoints may return the following error format:

```json
{
  "status": "error",
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found
- `500`: Internal Server Error
