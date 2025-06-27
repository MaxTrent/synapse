import winston from 'winston';
import { env } from '../config/env';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'development' 
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : logFormat,
    }),
  ],
});

export const createModuleLogger = (module: string) => ({
  info: (message: string, meta?: any) => logger.info(message, { module, ...meta }),
  error: (message: string, meta?: any) => logger.error(message, { module, ...meta }),
  warn: (message: string, meta?: any) => logger.warn(message, { module, ...meta }),
  debug: (message: string, meta?: any) => logger.debug(message, { module, ...meta }),
});