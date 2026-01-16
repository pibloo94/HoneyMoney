import { describe, it, expect } from 'vitest';
import { Category } from '../../models/Category.js';
import { createTestData } from '../../test-utils.js';

describe('Category Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid category', async () => {
      const categoryData = createTestData.category({
        id: 'test-category-1',
        name: 'Food',
        type: 'Expense',
        icon: 'pi-shopping-cart',
        color: '#FF5733'
      });

      const category = await Category.create(categoryData);

      expect(category.id).toBe('test-category-1');
      expect(category.name).toBe('Food');
      expect(category.type).toBe('Expense');
      expect(category.icon).toBe('pi-shopping-cart');
      expect(category.color).toBe('#FF5733');
    });

    it('should require all mandatory fields', async () => {
      const invalidCategory = { name: 'Test' }; // Missing required fields

      await expect(Category.create(invalidCategory)).rejects.toThrow();
    });

    it('should enforce unique id constraint', async () => {
      const categoryData = createTestData.category({ id: 'duplicate-id' });
      
      await Category.create(categoryData);
      
      // Try to create another with same id
      await expect(Category.create(categoryData)).rejects.toThrow();
    });

    it('should only accept Income or Expense as type', async () => {
      const invalidCategory = createTestData.category({
        type: 'InvalidType' as any
      });

      await expect(Category.create(invalidCategory)).rejects.toThrow();
    });

    it('should accept Income type', async () => {
      const incomeCategory = createTestData.category({
        type: 'Income'
      });

      const category = await Category.create(incomeCategory);
      expect(category.type).toBe('Income');
    });

    it('should accept Expense type', async () => {
      const expenseCategory = createTestData.category({
        type: 'Expense'
      });

      const category = await Category.create(expenseCategory);
      expect(category.type).toBe('Expense');
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt and updatedAt', async () => {
      const category = await Category.create(createTestData.category());

      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt when category is modified', async () => {
      const category = await Category.create(createTestData.category({ name: 'Original' }));
      const originalUpdatedAt = category.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      category.name = 'Updated';
      await category.save();

      expect(category.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Field Validation', () => {
    it('should require name field', async () => {
      const categoryData = createTestData.category();
      delete (categoryData as any).name;

      await expect(Category.create(categoryData)).rejects.toThrow();
    });

    it('should require id field', async () => {
      const categoryData = createTestData.category();
      delete (categoryData as any).id;

      await expect(Category.create(categoryData)).rejects.toThrow();
    });

    it('should require icon field', async () => {
      const categoryData = createTestData.category();
      delete (categoryData as any).icon;

      await expect(Category.create(categoryData)).rejects.toThrow();
    });

    it('should require color field', async () => {
      const categoryData = createTestData.category();
      delete (categoryData as any).color;

      await expect(Category.create(categoryData)).rejects.toThrow();
    });
  });
});
