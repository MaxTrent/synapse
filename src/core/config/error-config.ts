import { Application } from 'express';
import { errorHandler, notFoundHandler } from '../middleware/error-handler';

export const configureErrorHandling = (app: Application): void => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};