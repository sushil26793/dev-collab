import { Schema, model, Document,Types } from 'mongoose';


export interface IInvitation extends Document {
    team: Types.ObjectId;
    inviter: Types.ObjectId;
    invitee: Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const invitationSchema = new Schema({
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invitee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })


export const Invitation = model<IInvitation>('Invitation', invitationSchema);

