import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  icon: string;
  color: string;
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
