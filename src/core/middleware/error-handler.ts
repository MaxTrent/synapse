import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { ResponseHandler } from '../utils/response';
import { createModuleLogger } from '../utils/logger';

const logger = createModuleLogger('ErrorHandler');

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error caught by handler', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  if (error instanceof AppError) {
    return ResponseHandler.error(res, error.message, error.statusCode);
  }

  if (error instanceof ZodError) {
    const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return ResponseHandler.badRequest(res, `Validation error: ${message}`);
  }

  if (error.name === 'ValidationError') {
    return ResponseHandler.badRequest(res, 'Validation failed', error.message);
  }

  if (error.name === 'CastError') {
    return ResponseHandler.badRequest(res, 'Invalid ID format');
  }

  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    return ResponseHandler.conflict(res, 'Resource already exists');
  }

  return ResponseHandler.error(res, 'Something went wrong');
};

export const notFoundHandler = (req: Request, res: Response) => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};