import mongoose, { Document, Schema, Types } from "mongoose";

// Define the metadata type as an indexable interface
interface IMetadata {
  [key: string]: any;
}

// Define the main Notification document interface
interface INotification extends Document {
  userId: Types.ObjectId;
  type: "message" | "proposal" | "payment" | "milestone";
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
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
      enum: ["message", "proposal", "payment", "milestone"],
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    actionLink: { 
      type: String 
    },
    metadata: { 
      type: Object 
    },
  },
  { timestamps: true }
);

// Create and export the model
const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;