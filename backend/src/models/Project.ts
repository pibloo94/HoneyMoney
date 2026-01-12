import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  name: string;
  members: string[];
  description?: string;
  color: string;
}

const ProjectSchema = new Schema<IProject>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  members: { type: [String], required: true },
  description: { type: String },
  color: { type: String, required: true }
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
