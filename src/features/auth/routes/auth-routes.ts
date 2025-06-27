import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../../../core/utils/validation';
import { authSchemas } from '../validators/auth-validator';
import { authLimiter } from '../../../core/middleware/rate-limiter';

const router = Router();

router.post('/signup', 
  authLimiter,
  validateRequest({ body: authSchemas.signup }),
  AuthController.signup
);

router.post('/login',
  authLimiter, 
  validateRequest({ body: authSchemas.login }),
  AuthController.login
);

export { router as authRoutes };