import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const withLogging = (fn: Function, operation: string) => 
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${operation}] Starting operation`, { 
      method: req.method, 
      path: req.path,
      userId: (req as any).user?.id 
    });
    
    const start = Date.now();
    await fn(req, res, next);
    
    console.log(`[${operation}] Completed in ${Date.now() - start}ms`);
  });