import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  senderId: { type: String, required: true },
  contactId: { type: String, required: true },
  timestamp: { type: String,default: Date.now },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
