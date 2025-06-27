import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiLimiter } from '../middleware/rate-limiter';
import { env } from './env';

export const configureMiddleware = (app: Application): void => {
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(apiLimiter);
  app.use(express.json({ limit: env.UPLOAD_MAX_SIZE }));
  app.use(express.urlencoded({ extended: true }));
};