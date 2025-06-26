import mongoose, { Document, Schema, Model } from "mongoose";

export interface IClientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  profilePic?: string;
  coverPic?: string; 
  companyName?: string;
  location?: string;
  website?: string;
  description?: string;
  totalJobsPosted: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientProfileSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    profilePic: { type: String },
    coverPic: { type: String }, 
    companyName: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
    totalJobsPosted: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ClientProfile: Model<IClientProfile> = mongoose.model<IClientProfile>(
  "ClientProfile",
  ClientProfileSchema
);

export default ClientProfile;