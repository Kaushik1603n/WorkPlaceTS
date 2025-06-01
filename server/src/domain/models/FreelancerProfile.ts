import mongoose, { Document, Schema, Model } from "mongoose";

interface IFreelancerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  profilePic?: string;
  coverPic?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
  availability?: "full-time" | "part-time" | "not-available";
  experienceLevel?: string;
  education?: string;
  languages?: string;
  reference?: string;
  rating?: number;
  totalJobs?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const FreelancerProfileSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headline: { type: String },
    bio: { type: String },
    profilePic: { type: String },
    coverPic: { type: String },
    skills: {
      type: [String], // Array of strings
      default: [],
    },
    hourlyRate: { type: Number },
    location: { type: String },
    availability: {
      type: String,
      enum: ["full-time", "part-time", "not-available"],
    },
    experienceLevel: {
      type: String,
    },
    education: { type: String },
    languages: { type: String },
    reference: { type: String },
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FreelancerProfile: Model<IFreelancerProfile> =
  mongoose.model<IFreelancerProfile>(
    "FreelancerProfile",
    FreelancerProfileSchema
  );

export default FreelancerProfile;
