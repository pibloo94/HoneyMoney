export const createTestData = {
  category: (overrides = {}) => ({
    id: crypto.randomUUID(),
    name: 'Test Category',
    type: 'Expense' as const,
    icon: 'pi-test',
    color: '#FF0000',
    ...overrides
  }),
  
  project: (overrides = {}) => ({
    id: crypto.randomUUID(),
    name: 'Test Project',
    description: 'Test Description',
    members: ['Member 1', 'Member 2'],
    ...overrides
  }),
  
  transaction: (overrides = {}) => ({
    id: crypto.randomUUID(),
    description: 'Test Transaction',
    amount: 100,
    type: 'Expense' as const,
    categoryId: 'test-category-id',
    categoryName: 'Test Category',
    projectId: 'test-project-id',
    member: 'Member 1',
    date: new Date(),
    ...overrides
  })
};
