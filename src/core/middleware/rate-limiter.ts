import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ResponseHandler } from '../utils/response';

export const createRateLimiter = (windowMs?: number, max?: number) =>
  rateLimit({
    windowMs: windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: max || env.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      ResponseHandler.error(res, 'Rate limit exceeded', 429);
    },
  });

export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiLimiter = createRateLimiter(); // Default limits
export const uploadLimiter = createRateLimiter(60 * 60 * 1000, 10); // 10 uploads per hour