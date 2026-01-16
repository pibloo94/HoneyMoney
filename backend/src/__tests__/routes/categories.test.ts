import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../server-app.js';
import { Category } from '../../models/Category.js';
import { createTestData } from '../../test-utils.js';

describe('Categories API', () => {
  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app).get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all categories', async () => {
      // Create test categories
      const category1 = await Category.create(createTestData.category({ name: 'Food' }));
      const category2 = await Category.create(createTestData.category({ name: 'Transport' }));
      
      const response = await request(app).get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Food');
      expect(response.body[1].name).toBe('Transport');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const category = await Category.create(createTestData.category({ 
        id: 'test-id-123',
        name: 'Groceries' 
      }));
      
      const response = await request(app).get('/api/categories/test-id-123');
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Groceries');
      expect(response.body.id).toBe('test-id-123');
    });

    it('should return 404 when category not found', async () => {
      const response = await request(app).get('/api/categories/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const newCategory = createTestData.category({ name: 'Entertainment' });
      
      const response = await request(app)
        .post('/api/categories')
        .send(newCategory);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Entertainment');
      expect(response.body.id).toBe(newCategory.id);
      
      // Verify it was saved to database
      const savedCategory = await Category.findOne({ id: newCategory.id });
      expect(savedCategory).toBeTruthy();
      expect(savedCategory?.name).toBe('Entertainment');
    });

    it('should return 400 for invalid category data', async () => {
      const invalidCategory = { name: 'Test' }; // Missing required fields
      
      const response = await request(app)
        .post('/api/categories')
        .send(invalidCategory);
      
      expect(response.status).toBe(400);
    });

    it('should enforce type enum constraint', async () => {
      const invalidCategory = createTestData.category({ 
        type: 'InvalidType' as any 
      });
      
      const response = await request(app)
        .post('/api/categories')
        .send(invalidCategory);
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const category = await Category.create(createTestData.category({ 
        id: 'update-test-id',
        name: 'Old Name' 
      }));
      
      const response = await request(app)
        .put('/api/categories/update-test-id')
        .send({ name: 'New Name' });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      
      // Verify database was updated
      const updatedCategory = await Category.findOne({ id: 'update-test-id' });
      expect(updatedCategory?.name).toBe('New Name');
    });

    it('should return 404 when updating non-existent category', async () => {
      const response = await request(app)
        .put('/api/categories/non-existent')
        .send({ name: 'Updated' });
      
      expect(response.status).toBe(404);
    });

    it('should validate updated data', async () => {
      const category = await Category.create(createTestData.category({ id: 'validate-test' }));
      
      const response = await request(app)
        .put('/api/categories/validate-test')
        .send({ type: 'InvalidType' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const category = await Category.create(createTestData.category({ 
        id: 'delete-test-id' 
      }));
      
      const response = await request(app).delete('/api/categories/delete-test-id');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Category deleted successfully');
      
      // Verify it was deleted from database
      const deletedCategory = await Category.findOne({ id: 'delete-test-id' });
      expect(deletedCategory).toBeNull();
    });

    it('should return 404 when deleting non-existent category', async () => {
      const response = await request(app).delete('/api/categories/non-existent');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });
  });
});
