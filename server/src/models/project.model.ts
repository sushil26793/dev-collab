import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document<Types.ObjectId> {
  title: string;
  description?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  tasks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
  },
  { timestamps: true } // ✅ Ensures createdAt & updatedAt exist
);

export const Project = model<IProject>('Project', ProjectSchema);
