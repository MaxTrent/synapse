import { Schema, model, Document } from 'mongoose';
import { ContentType, ContentStatus } from '../../../core/types';

export interface IContent extends Document {
  title: string;
  description: string;
  contentType: ContentType;
  fileUrl: string;
  price: number;
  tags: string[];
  creator: Schema.Types.ObjectId;
  status: ContentStatus;
  aiSummary?: string;
  aiTags: string[];
  purchaseCount: number;
  reactionCount: number;
  flagCount: number;
  reputation: number;
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  contentType: { type: String, enum: Object.values(ContentType), required: true },
  fileUrl: { type: String, required: true },
  price: { type: Number, default: 0, min: 0 },
  tags: [{ type: String }],
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(ContentStatus), default: ContentStatus.PUBLISHED },
  aiSummary: { type: String },
  aiTags: [{ type: String }],
  purchaseCount: { type: Number, default: 0 },
  reactionCount: { type: Number, default: 0 },
  flagCount: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
}, { timestamps: true });

contentSchema.index({ creator: 1, status: 1 });
contentSchema.index({ tags: 1 });

export const Content = model<IContent>('Content', contentSchema);