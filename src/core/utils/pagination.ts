import { PaginationQuery, PaginationMeta } from '../types';

export class PaginationHelper {
  static createMeta(
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }

  static getSkipLimit(query: PaginationQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;
    
    return { skip, limit, page };
  }

  static buildSortObject(sortString?: string): Record<string, 1 | -1> {
    if (!sortString) return { createdAt: -1 };
    
    const [field, order] = sortString.split(':');
    return { [field]: order === 'asc' ? 1 : -1 };
  }
}