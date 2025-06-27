import { BaseRepository } from '../../../core/base/base-repository';
import { Content, IContent } from '../models/Content';

export class ContentRepository extends BaseRepository<IContent> {
  constructor() {
    super(Content);
  }

  async findByCreator(creatorId: string): Promise<IContent[]> {
    console.log(`Finding content by creator: ${creatorId}`);
    return await this.model.find({ creator: creatorId }).populate('creator', 'username reputation');
  }

  async findPublished(): Promise<IContent[]> {
    console.log('Finding all published content');
    return await this.model.find({ status: 'published' }).populate('creator', 'username reputation');
  }

  async searchByTags(tags: string[]): Promise<IContent[]> {
    console.log(`Searching content by tags:`, tags);
    return await this.model.find({ 
      tags: { $in: tags },
      status: 'published'
    }).populate('creator', 'username reputation');
  }
}