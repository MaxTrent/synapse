import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginationQuery, PaginationMeta } from '../types';
import { PaginationHelper } from '../utils/pagination';

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    console.log(`Creating new ${this.model.modelName}:`, data);
    const document = new this.model(data);
    const result = await document.save();
    console.log(`Created ${this.model.modelName} with ID:`, result._id);
    return result;
  }

  async findById(id: string): Promise<T | null> {
    console.log(`Finding ${this.model.modelName} by ID:`, id);
    const result = await this.model.findById(id);
    console.log(`Found ${this.model.modelName}:`, !!result);
    return result;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    console.log(`Finding one ${this.model.modelName}:`, filter);
    const result = await this.model.findOne(filter);
    console.log(`Found ${this.model.modelName}:`, !!result);
    return result;
  }

  async findMany(filter: FilterQuery<T> = {}): Promise<T[]> {
    console.log(`Finding many ${this.model.modelName}:`, filter);
    const results = await this.model.find(filter);
    console.log(`Found ${results.length} ${this.model.modelName}s`);
    return results;
  }

  async findWithPagination(
    filter: FilterQuery<T>,
    pagination: PaginationQuery
  ): Promise<{ data: T[]; meta: PaginationMeta }> {
    const { skip, limit, page } = PaginationHelper.getSkipLimit(pagination);
    const sort = PaginationHelper.buildSortObject(pagination.sort) as any;

    console.log(`Paginated query for ${this.model.modelName}:`, { filter, skip, limit, sort });

    const [data, totalItems] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);

    const meta = PaginationHelper.createMeta(totalItems, page, limit);
    
    console.log(`Paginated results: ${data.length} items, page ${page}/${meta.totalPages}`);
    
    return { data, meta };
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    console.log(`Updating ${this.model.modelName} ${id}:`, update);
    const result = await this.model.findByIdAndUpdate(id, update, { new: true });
    console.log(`Updated ${this.model.modelName}:`, !!result);
    return result;
  }

  async deleteById(id: string): Promise<boolean> {
    console.log(`Deleting ${this.model.modelName}:`, id);
    const result = await this.model.findByIdAndDelete(id);
    console.log(`Deleted ${this.model.modelName}:`, !!result);
    return !!result;
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.exists(filter);
    console.log(`${this.model.modelName} exists check:`, !!result);
    return !!result;
  }
}