import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  id: string;
  text?: string;
  senderId: string;
  contactId: string;
  media?: {
    url: string;
    type: "image" | "pdf";
  };
  timestamp: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    text: { type: String },
    media: {
      url: { type: String },
      type: { type: String, enum: ["image", "pdf"] },
    },
    senderId: { type: String, required: true },
    contactId: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);