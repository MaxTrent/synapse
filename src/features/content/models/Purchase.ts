import { Schema, model, Document } from 'mongoose';

export interface IPurchase extends Document {
  buyer: Schema.Types.ObjectId;
  content: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  amount: number;
  transactionId: string;
}

const purchaseSchema = new Schema<IPurchase>({
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true },
}, { timestamps: true });

purchaseSchema.index({ buyer: 1 });
purchaseSchema.index({ creator: 1 });

export const Purchase = model<IPurchase>('Purchase', purchaseSchema);