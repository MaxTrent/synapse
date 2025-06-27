import { Schema, model, Document } from 'mongoose';

export interface IReaction extends Document {
  user: Schema.Types.ObjectId;
  content: Schema.Types.ObjectId;
  type: 'like' | 'dislike' | 'love' | 'fire';
  tokenReward: number;
}

const reactionSchema = new Schema<IReaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  type: { type: String, enum: ['like', 'dislike', 'love', 'fire'], required: true },
  tokenReward: { type: Number, default: 1 },
}, { timestamps: true });

reactionSchema.index({ user: 1, content: 1 }, { unique: true });

export const Reaction = model<IReaction>('Reaction', reactionSchema);