# Backend Testing Guide

The backend uses **Vitest** + **Supertest** + **MongoDB Memory Server**.

## Infrastructure Components

- **Vitest**: The test runner and assertion library.
- **Supertest**: Used for making HTTP requests to the Express app in integration tests.
- **MongoDB Memory Server**: Provides a real, ephemeral MongoDB instance for each test run, ensuring database tests are isolated and fast.
- **test-setup.ts**: Handles the lifecycle of the memory server and provides common test data factories.

## Testing Types

### 1. API Integration Tests (`src/__tests__/routes/*.test.ts`)

These tests verify that our endpoints correctly handle requests, interact with the database, and return the expected status codes and data.

```typescript
import request from 'supertest';
import { app } from '../../server-app';

describe('POST /api/categories', () => {
  it('should create a new category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ name: 'New Category', ... });
    expect(response.status).toBe(201);
  });
});
```

### 2. Model Validation Tests (`src/__tests__/models/*.test.ts`)

Verify Mongoose schema constraints, default values, and custom validation logic.

### 3. Server Tests (`src/__tests__/server.test.ts`)

Basic health checks and route mounting verification.

## Test Data Factories

Use the `createTestData` object in `src/test-setup.ts` to generate consistent mock data for your tests.

```typescript
import { createTestData } from '../../test-setup';

const mockCategory = createTestData.category({ name: 'Special Category' });
```

## Troubleshooting

- **Async Errors**: Ensure all database operations are awaited.
- **Database Cleanup**: The `test-setup.ts` automatically clears all collections after each test to prevent side effects.
- **'vitest' Command Not Found**: Run tests using `npm test` or `npx vitest` instead of calling `vitest` directly.
