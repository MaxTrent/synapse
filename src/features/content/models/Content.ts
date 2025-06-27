import { Schema, model, Document, Types } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  type: 'text' | 'image' | 'audio' | 'video';
  fileUrl?: string;
  price: number;
  creator: Types.ObjectId;
  tags: string[];
  aiSummary?: string;
  purchases: number;
  rating: number;
  votes: number;
  flagged: boolean;
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'audio', 'video'], required: true },
  fileUrl: String,
  price: { type: Number, required: true, min: 0 },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  aiSummary: String,
  purchases: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false },
}, { timestamps: true });

export const Content = model<IContent>('Content', contentSchema);