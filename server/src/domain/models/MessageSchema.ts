import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}

// Message Schema
const MessageSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  senderId: { type: String, required: true },
  contactId: { type: String, required: true },
  timestamp: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
