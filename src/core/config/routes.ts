import { Application } from 'express';
import { logger } from '../utils/logger';
import { authRoutes } from '../../features/auth/routes/auth-routes';

export const configureRoutes = (app: Application): void => {
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1', (req, res, next) => {
    logger.info(`API Request: ${req.method} ${req.path}`);
    next();
  });

  app.use('/api/v1/auth', authRoutes);
};