import { Document } from 'mongoose';
import { BaseRepository } from './base-repository';
import { PaginationQuery } from '../types';
import { AppError } from '../middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

export abstract class BaseService<T extends Document> {
  constructor(protected repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    console.log(`Service: Creating ${this.constructor.name.replace('Service', '')}`, data);
    return await this.repository.create(data);
  }

  async getById(id: string): Promise<T> {
    console.log(`Service: Getting ${this.constructor.name.replace('Service', '')} by ID:`, id);
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }
    return entity;
  }

  async getAll(pagination?: PaginationQuery) {
    console.log(`Service: Getting all ${this.constructor.name.replace('Service', '')}s`, pagination);
    if (pagination) {
      return await this.repository.findWithPagination({}, pagination);
    }
    const data = await this.repository.findMany();
    return { data };
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    console.log(`Service: Updating ${this.constructor.name.replace('Service', '')}:`, { id, data });
    const entity = await this.repository.updateById(id, data);
    if (!entity) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    console.log(`Service: Deleting ${this.constructor.name.replace('Service', '')}:`, id);
    const deleted = await this.repository.deleteById(id);
    if (!deleted) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.exists({ _id: id } as any);
  }
}