import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  id: string;
  description: string;
  amount: number;
  date: Date;
  projectId: string;
  categoryId: string;
  categoryName: string;
  member: string;
  type: 'Income' | 'Expense';
}

const TransactionSchema = new Schema<ITransaction>({
  id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  projectId: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  member: { type: String, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true }
}, {
  timestamps: true
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
