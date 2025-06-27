import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    reputation: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    pagination?: PaginationMeta;
    timestamp?: string;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  CONSUMER = 'consumer',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  FLAGGED = 'flagged',
  REMOVED = 'removed'
}

export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenEconomy {
  balance: number;
  earned: number;
  spent: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
  relatedContentId?: string;
}