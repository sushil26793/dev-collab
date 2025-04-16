// models/Project.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high';
  team: Types.ObjectId[];
  createdBy: Types.ObjectId;
  dueDate: Date;
  starred: boolean;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'on-hold', 'completed'],
      default: 'planning'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: { type: Date, required: true },
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    starred: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


ProjectSchema.virtual('id').get(function(this:IProject){
  return ( this._id as Types.ObjectId).toHexString()
})
// Use existing model if it exists, otherwise create a new one
const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const Project = ProjectModel;
