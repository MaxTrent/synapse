import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ResponseHandler } from '../utils/response';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseHandler.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return ResponseHandler.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

export const requireCreator = requireRole(['creator', 'admin']);
export const requireModerator = requireRole(['moderator', 'admin']);
export const requireAdmin = requireRole(['admin']);