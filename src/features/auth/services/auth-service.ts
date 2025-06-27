import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../../../core/config/env';
import { AppError } from '../../../core/middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

export class AuthService {
  static async signup(email: string, username: string, password: string, role = 'consumer') {
    console.log(`Signup attempt: ${email}, ${username}, role: ${role}`);
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User already exists', StatusCodes.CONFLICT);
    }

    const user = await User.create({ email, username, password, role });
    const token = this.generateToken((user._id as any).toString());
    
    console.log(`User created: ${user.username} with ${user.tokenBalance} tokens`);
    return { user: this.sanitizeUser(user), token };
  }

  static async login(email: string, password: string) {
    console.log(`Login attempt: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError('Account deactivated', StatusCodes.FORBIDDEN);
    }

    const token = this.generateToken((user._id as any).toString());
    console.log(`Login successful: ${user.username}`);
    return { user: this.sanitizeUser(user), token };
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
  }

  private static sanitizeUser(user: IUser) {
    const { password, ...sanitized } = user.toObject();
    return sanitized;
  }
}