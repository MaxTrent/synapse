import { Request, Response } from 'express';
import { Document } from 'mongoose';
import { BaseService } from './base-service';
import { ResponseHandler } from '../utils/response';
import { asyncHandler } from '../utils/async-handler';
import { PaginationQuery } from '../types';

export abstract class BaseController<T extends Document> {
  constructor(protected service: BaseService<T>) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    ResponseHandler.created(res, data);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    ResponseHandler.success(res, data);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getAll(req.query as PaginationQuery);
    ResponseHandler.success(res, result.data, 'Success', 200);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(req.params.id, req.body);
    ResponseHandler.success(res, data);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    ResponseHandler.success(res, null, 'Deleted successfully');
  });
}