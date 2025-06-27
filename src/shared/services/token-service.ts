import { User } from '../../features/auth/models/User';
import { createModuleLogger } from '../../core/utils/logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createModuleLogger('TokenService');

export class TokenService {
  static async transferTokens(fromUserId: string, toUserId: string, amount: number, reason: string) {
    logger.info(`Token transfer: ${amount} from ${fromUserId} to ${toUserId} - ${reason}`);
    
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId)
    ]);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    fromUser.spendTokens(amount);
    toUser.addTokens(amount);

    await Promise.all([fromUser.save(), toUser.save()]);
    
    logger.info(`Transfer completed: ${amount} tokens`);
    return { transactionId: uuidv4(), amount, reason };
  }

  static async rewardUser(userId: string, amount: number, reason: string) {
    logger.info(`Rewarding user ${userId} with ${amount} tokens - ${reason}`);
    
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.addTokens(amount);
    await user.save();

    logger.info(`Reward completed: ${amount} tokens`);
    return { amount, reason };
  }

  static async getUserBalance(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return {
      balance: user.tokenBalance,
      totalEarned: user.totalEarned,
      totalSpent: user.totalSpent
    };
  }
}