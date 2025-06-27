import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: 'creator' | 'consumer' | 'moderator';
  tokenBalance: number;
  totalEarned: number;
  totalSpent: number;
  reputation: number;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  comparePassword(password: string): Promise<boolean>;
  addTokens(amount: number): void;
  spendTokens(amount: number): void;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['creator', 'consumer', 'moderator'], default: 'consumer' },
  tokenBalance: { type: Number, default: 1000 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  reputation: { type: Number, default: 100 },
  avatar: { type: String },
  bio: { type: String, maxlength: 500 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.addTokens = function(amount: number) {
  this.tokenBalance += amount;
  this.totalEarned += amount;
  console.log(`Added ${amount} tokens to user ${this.username}. New balance: ${this.tokenBalance}`);
};

userSchema.methods.spendTokens = function(amount: number) {
  if (this.tokenBalance < amount) throw new Error('Insufficient tokens');
  this.tokenBalance -= amount;
  this.totalSpent += amount;
  console.log(`User ${this.username} spent ${amount} tokens. Remaining: ${this.tokenBalance}`);
};

export const User = model<IUser>('User', userSchema);