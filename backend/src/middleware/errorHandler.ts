import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as any;
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Default error response
  let response: ErrorResponse = {
    success: false,
    message: 'Internal Server Error',
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    response.message = 'Resource not found';
    res.status(404);
  }
  // Mongoose duplicate key
  else if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    response.message = `${field} already exists`;
    res.status(400);
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    response.message = 'Validation Error';
    response.errors = errors;
    res.status(400);
  }
  // Zod validation error
  else if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
    response.message = 'Validation Error';
    response.errors = errors;
    res.status(400);
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    response.message = 'Invalid token';
    res.status(401);
  }
  else if (err.name === 'TokenExpiredError') {
    response.message = 'Token expired';
    res.status(401);
  }
  // Custom AppError
  else if (err instanceof AppError) {
    response.message = err.message;
    res.status(err.statusCode);
  }
  // Default to 500 server error
  else {
    res.status(500);
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.json(response);
};
