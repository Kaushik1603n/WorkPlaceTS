import mongoose, { Schema, Document, Model } from "mongoose";

// Enums
export enum UserRole {
  FREELANCER = "freelancer",
  CLIENT = "client",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCK = "block",
  DELETED = "deleted",
}

export enum SocialProvider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  GITHUB = "github",
}
export enum verification {
  FALSE = "false",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export interface FreelancerRatingStats {
  avgQuality: number;
  avgDeadlines: number;
  avgProfessionalism: number;
}

export interface ClientRatingStats {
  avgClarity: number;
  avgPayment: number;
  avgCommunication: number;
}

// Interfaces
export interface SocialLogin {
  provider: SocialProvider;
  providerId: string;
}

export interface User extends Document {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  isVerification: verification;
  otp?: number;
  otpExpiry?: Date;
  refreshToken?: string | null;
  googleId?: string;
  pic?: string;
  socialLogins?: SocialLogin[];
  status: UserStatus;
  lastLogin?: Date;
  jobs?: any[];
  profile?: any;
  avgRating?: number;
  feedbackCount: number;
  freelancerRatings?: FreelancerRatingStats;
  clientRatings?: ClientRatingStats;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const UserSchema = new Schema<User>(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
    },
    isVerified: { type: Boolean, default: false },
    isVerification: {
      type: String,
      enum: Object.values(verification),
      default: verification.FALSE,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    feedbackCount: { type: Number, default: 0 },
    freelancerRatings: {
      avgQuality: { type: Number, default: 0, min: 0, max: 5 },
      avgDeadlines: { type: Number, default: 0, min: 0, max: 5 },
      avgProfessionalism: { type: Number, default: 0, min: 0, max: 5 },
    },
    clientRatings: {
      avgClarity: { type: Number, default: 0, min: 0, max: 5 },
      avgPayment: { type: Number, default: 0, min: 0, max: 5 },
      avgCommunication: { type: Number, default: 0, min: 0, max: 5 },
    },
    otp: { type: Number },
    otpExpiry: { type: Date },
    refreshToken: { type: String, default: null },
    googleId: { type: String, unique: true, sparse: true },
    pic: { type: String },
    socialLogins: [
      {
        provider: { type: String, enum: Object.values(SocialProvider) },
        providerId: { type: String },
      },
    ],
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Virtuals
UserSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "clientId",
});

UserSchema.virtual("profile", {
  ref: "FreelancerProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

// Export model
const UserModel: Model<User> = mongoose.model<User>("User", UserSchema);
export default UserModel;
