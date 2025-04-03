

import { Schema, model, Document } from 'mongoose';


export interface IMessage extends Document {
    sender: string;
    avatar: string;
    content: string;
    timestamp: Date;
    status: 'send' | 'delivered' | 'read';
    reactions: Map<string, number>;
    isCode: boolean;
    mentions: string[];
    room: string;
    isFile: boolean;
    fileType: string;
}


const messageSchema = new Schema({
    sender: { type: String, required: true },
    avatar: { type: String, default: '' },
    content: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['send', 'delivered', 'read'], default: 'send' },
    reactions: { type: Map, of: Number, default: {} },
    isCode: { type: Boolean, default: false },
    mentions: [{ type: String }],
    room: { type: String, required: true, default: 'global_chat' },
    isFile: { type: Boolean, default: false },
    fileType: { type: String, default: '' }
}, {
    timestamps: true
})


export const Message = model<IMessage>('Message', messageSchema);