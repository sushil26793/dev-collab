import { Schema, model, Document, Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface ITask extends Document<Types.ObjectId> {
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: Types.ObjectId;
  project: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: TaskStatus, // ✅ Correct enum mapping
      default: TaskStatus.TODO
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
  },
  { timestamps: true } // ✅ This ensures createdAt & updatedAt exist
);

export const Task = model<ITask>('Task', TaskSchema);
