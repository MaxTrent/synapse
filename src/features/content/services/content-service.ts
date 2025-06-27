import { BaseService } from '../../../core/base/base-service';
import { ContentRepository } from '../repositories/content-repository';
import { IContent } from '../models/Content';
import { User } from '../../auth/models/User';
import { Purchase } from '../models/Purchase';
import { AppError } from '../../../core/middleware/error-handler';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export class ContentService extends BaseService<IContent> {
  constructor(private contentRepo: ContentRepository) {
    super(contentRepo);
  }

  async createContent(creatorId: string, data: Partial<IContent>) {
    console.log(`Creating content for creator ${creatorId}:`, data);
    const content = await this.contentRepo.create({ ...data, creator: creatorId as any });
    
    
    // TODO: Trigger AI processing for summary and tags
    console.log(`Content created with ID: ${content._id}`);
    return content;
  }

  async purchaseContent(buyerId: string, contentId: string) {
    console.log(`Processing purchase: buyer ${buyerId}, content ${contentId}`);
    
    const [buyer, content] = await Promise.all([
      User.findById(buyerId),
      this.contentRepo.findById(contentId)
    ]);

    if (!buyer || !content) {
      throw new AppError('Buyer or content not found', StatusCodes.NOT_FOUND);
    }

    if (content.price === 0) {
      console.log('Content is free, no payment required');
      return { success: true, message: 'Free content accessed' };
    }

    if (buyer.tokenBalance < content.price) {
      throw new AppError('Insufficient tokens', StatusCodes.BAD_REQUEST);
    }

    const creator = await User.findById(content.creator);
    if (!creator) {
      throw new AppError('Creator not found', StatusCodes.NOT_FOUND);
    }

    // Process transaction
    buyer.spendTokens(content.price);
    creator.addTokens(content.price);
    content.purchaseCount += 1;

    await Promise.all([
      buyer.save(),
      creator.save(),
      content.save(),
      Purchase.create({
        buyer: buyerId,
        content: contentId,
        creator: content.creator,
        amount: content.price,
        transactionId: uuidv4()
      })
    ]);

    console.log(`Purchase completed: ${content.price} tokens transferred`);
    return { success: true, content };
  }

  async getPublicFeed(pagination: any) {
    console.log('Fetching public content feed');
    return await this.contentRepo.findWithPagination(
      { status: 'published' },
      pagination
    );
  }

  async getCreatorContent(creatorId: string, pagination: any) {
    console.log(`Fetching content for creator ${creatorId}`);
    return await this.contentRepo.findWithPagination(
      { creator: creatorId },
      pagination
    );
  }
}