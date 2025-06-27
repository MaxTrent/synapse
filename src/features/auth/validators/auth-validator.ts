import { z } from 'zod';
import { commonSchemas } from '../../../core/utils/validation';

export const authSchemas = {
  signup: z.object({
    email: commonSchemas.email,
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: commonSchemas.password,
    role: z.enum(['consumer', 'creator', 'moderator']).optional(),
  }),

  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),
};