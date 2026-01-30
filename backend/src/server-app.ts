import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';

// Export app separately for testing
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HoneyMoney API is running' });
});

// Error handling - MUST be after routes
app.use(errorHandler);
