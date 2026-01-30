# HoneyMoney Testing Guide

Welcome to the HoneyMoney testing documentation. This project uses **Vitest** for both the backend and frontend to ensure high performance and a consistent testing experience.

> [!IMPORTANT]
> Always run tests using **NPM scripts** (e.g., `npm test`) or by prefixing the command with **npx** (e.g., `npx vitest`). Running `vitest` directly may fail if it's not installed globally on your system.

## Quick Start

### Backend Tests

```bash
cd backend
npm test          # Run tests in watch mode
npm run test:run  # Run tests once
npm run test:ui   # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### Frontend Tests

```bash
npm test          # Run tests in watch mode
npm run test:run  # Run tests once
npm run test:ui   # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### Pre-commit Hooks

We use **Husky** to ensure that all tests pass before allowing a commit.

- If you try to `git commit`, both backend and frontend tests will run automatically.
- If any test fails, the commit will be blocked.

```bash
# This happens automatically on commit
npm run test:run
```

## Testing Philosophy

We follow a balanced testing strategy:

1.  **Unit Tests (Fastest):** Test individual functions, models (backend), and utility classes.
2.  **Service/Integration Tests:** Test backend API routes using Supertest and frontend services with mocked dependencies.
3.  **Component Tests:** Test frontend components using Angular Testing Library to ensure user interactions and template rendering work as expected.

## Best Practices

- **Test Behavior, Not Implementation:** Focus on what the code _does_ rather than how it's written.
- **Isolate Tests:** Use the provided mocks and utilities to ensure tests don't depend on each other.
- **Keep Tests Clean:** Follow the AAA pattern (Arrange, Act, Assert).
- **Maintain Coverage:** Aim for at least 60-70% coverage on critical business logic.

## Documentation Links

- [Backend Testing Details](./backend/TESTING.md)
- [Testing Examples & Patterns](./docs/testing-examples.md)

## Common Issues

### 'vitest' is not recognized

If you see an error like `El término 'vitest' no se reconoce...`, it means you are trying to run the Vite CLI directly without having it in your system's PATH.

**Solution:**
Use the scripts defined in `package.json`:

```bash
npm test
```

Or use `npx`:

```bash
npx vitest
```
