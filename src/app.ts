import 'express-async-errors';
import 'reflect-metadata';
import express from 'express';
import { connectDB } from './core/database/connection';
import { env } from './core/config/env';
import { configureMiddleware } from './core/config/middleware';
import { configureRoutes } from './core/config/routes';
import { configureErrorHandling } from './core/config/error-config';
import { logger } from './core/utils/logger';

const app = express();

configureMiddleware(app);
configureRoutes(app);
configureErrorHandling(app);

export const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

export default app;