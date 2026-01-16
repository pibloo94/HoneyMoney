import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/projects.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';

// Export app separately for testing
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HoneyMoney API is running' });
});
