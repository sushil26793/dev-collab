import { Schema, model, Document, Types } from 'mongoose';

interface IMember {
  user: Types.ObjectId;
  role: 'ADMIN' | 'DEVELOPER' | 'VIEWER';
  joinedAt: Date;
}

interface ITeam extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId; // And here
  members: IMember[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ['ADMIN', 'DEVELOPER', 'VIEWER'],
          required: true,
        },
        joinedAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

TeamSchema.index({ name: "text", description: "text" });
TeamSchema.index({ owner: 1 });
TeamSchema.index({ members: 1 });

const Team = model<ITeam>("Team", TeamSchema);

export default Team;
