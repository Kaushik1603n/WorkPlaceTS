import mongoose, { Document, Schema, Types } from "mongoose";

// Define the metadata type as an indexable interface
interface IMetadata {
  [key: string]: any;
}

// Define the main Notification document interface
interface INotification extends Document {
  userId: Types.ObjectId;
  type: "message" | "proposal" | "payment" | "milestone" | "contract";
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
  content?: string;
  metadata?: IMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "proposal", "payment", "milestone","contract"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionLink: {
      type: String,
    },
    metadata: {
      type: Object,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default NotificationModel;
