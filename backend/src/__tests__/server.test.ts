import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server-app.js';

describe('Server Health Check', () => {
  it('should return 200 status for health endpoint', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'HoneyMoney API is running');
  });

  it('should return JSON content type', async () => {
    const response = await request(app).get('/health');
    
    expect(response.headers['content-type']).toMatch(/json/);
  });
});

describe('API Routes', () => {
  it('should have categories route mounted', async () => {
    const response = await request(app).get('/api/categories');
    
    // Should not return 404
    expect(response.status).not.toBe(404);
  });

  it('should have projects route mounted', async () => {
    const response = await request(app).get('/api/projects');
    
    // Should not return 404
    expect(response.status).not.toBe(404);
  });

  it('should have transactions route mounted', async () => {
    const response = await request(app).get('/api/transactions');
    
    // Should not return 404
    expect(response.status).not.toBe(404);
  });
});
