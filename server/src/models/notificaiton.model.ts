import { Schema, Document, model, Types } from 'mongoose';

export interface INotification extends Document {
  type: 'invitation' | 'alert' | 'system';
  content: string;
  status: 'read' | 'unread';
  createdAt: Date;
  recipientId: Types.ObjectId; // New field: identifies the intended user
  metadata?: {
    invitationId?: string;
    teamId?: string;
    inviterId?: string;
  };
}

const notificationSchema = new Schema<INotification>({
  type: { type: String, enum: ['invitation', 'alert', 'system'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  createdAt: { type: Date, default: Date.now, index: { expires: 172800 } },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: {
    invitationId: String,
    teamId: String,
    inviterId: String,
  },
});

export const Notification = model<INotification>('notification', notificationSchema);
