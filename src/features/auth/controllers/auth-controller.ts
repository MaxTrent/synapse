import { Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { ResponseHandler } from '../../../core/utils/response';
import { asyncHandler } from '../../../core/utils/async-handler';

export class AuthController {
  static signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password, role } = req.body;
    const result = await AuthService.signup(email, username, password, role);
    ResponseHandler.created(res, result, 'Account created successfully');
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    ResponseHandler.success(res, result, 'Login successful');
  });
}