# Testing Examples & Patterns

This document provides practical code snippets and patterns for common testing scenarios in HoneyMoney.

## 🟢 Backend Patterns (Fully Verified)

The backend uses **Vitest** + **Supertest** + **MongoDB Memory Server**.

### API Integration Tests

```typescript
describe('GET /api/categories', () => {
  it('should return all categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
  });
});
```

### Model Validation

```typescript
it('should require name field', async () => {
  const invalidCategory = { type: 'Expense' };
  await expect(Category.create(invalidCategory)).rejects.toThrow();
});
```

---

## 🟡 Frontend Patterns (Services Verified)

### Testing Services

Services are tested using `TestBed` and mocked dependencies. Use the `TestBed.resetTestingModule()` pattern if you need a fresh service in the middle of a test suite.

```typescript
it('should calculate total balance correctly', () => {
  const transactions = [{ amount: 100, type: 'Income' }];
  service = createService(transactions);
  expect(service.totalBalance()).toBe(100);
});
```

### ⚠️ Component Testing Note

When testing Angular components with `templateUrl` and `styleUrl` using Vitest in a pure `jsdom` environment, you may encounter "Component not resolved" errors. This is because JIT compilation cannot resolve relative files in Node.

**Recommended Solutions:**

1.  **Logic-Only Testing:** Test the component class logic by injecting its dependencies manually without `TestBed.createComponent`.
2.  **Mock Templates:** Use `TestBed.overrideComponent` to provide inline templates during tests.
3.  **AnalogJS Vitest Plugin:** For full resource resolution support, consider adding `@analogjs/vitest-angular` to your `vitest.config.ts`.

Example of Mocking for Component Tests:

```typescript
await TestBed.configureTestingModule({
  imports: [DashboardComponent],
})
  .overrideComponent(DashboardComponent, {
    set: { template: '<div>Dashboard</div>', styles: [] },
  })
  .compileComponents();
```

---

## 🚀 Anti-Patterns to Avoid

- ❌ **Testing Private Methods**: Test behavior through public APIs instead.
- ❌ **Circular Dependencies**: Keep test utilities (`test-utils.ts`) separate from infrastructure setup (`vitest-setup.ts`).
- ❌ **Real Database Calls**: Always use the provided memory server or mocks.
