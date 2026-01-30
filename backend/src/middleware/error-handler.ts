import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.message || err);
  
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Handle Mongoose Cast Errors (Invalid ID format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }
  
  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
