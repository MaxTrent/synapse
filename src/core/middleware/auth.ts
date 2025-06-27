import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../features/auth/models/User';
import { AuthRequest } from '../types';
import { env } from '../config/env';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access denied' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = { 
      id: (user._id as any).toString(), 
      email: user.email, 
      role: user.role as any,
      reputation: user.reputation || 0
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};