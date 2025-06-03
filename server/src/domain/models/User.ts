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

// Interfaces
export interface SocialLogin {
  provider: SocialProvider;
  providerId: string;
}

export interface User extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
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
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

// Export model
const UserModel: Model<User> = mongoose.model<User>("User", UserSchema);
export default UserModel;
