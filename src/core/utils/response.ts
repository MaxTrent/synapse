import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from './logger';
import { ApiResponse } from '../types';

export class ResponseHandler {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = StatusCodes.OK): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    
    logger.debug('API Success Response', { statusCode, message });
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message = 'Internal Server Error', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, error?: any): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: error?.message || error,
    };
    
    logger.error('API Error Response', { statusCode, message, error });
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  static badRequest(res: Response, message = 'Bad Request', error?: any): Response {
    return this.error(res, message, StatusCodes.BAD_REQUEST, error);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, StatusCodes.UNAUTHORIZED);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, StatusCodes.FORBIDDEN);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, StatusCodes.NOT_FOUND);
  }

  static conflict(res: Response, message = 'Conflict'): Response {
    return this.error(res, message, StatusCodes.CONFLICT);
  }
}