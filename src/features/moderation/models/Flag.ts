import { Schema, model, Document } from 'mongoose';

export interface IFlag extends Document {
  content: Schema.Types.ObjectId;
  reporter: Schema.Types.ObjectId;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  moderator?: Schema.Types.ObjectId;
  moderatorAction?: 'approved' | 'removed' | 'warned';
  notes?: string;
}

const flagSchema = new Schema<IFlag>({
  content: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  moderator: { type: Schema.Types.ObjectId, ref: 'User' },
  moderatorAction: { type: String, enum: ['approved', 'removed', 'warned'] },
  notes: { type: String, maxlength: 1000 },
}, { timestamps: true });

flagSchema.index({ status: 1 });
flagSchema.index({ content: 1 });

export const Flag = model<IFlag>('Flag', flagSchema);