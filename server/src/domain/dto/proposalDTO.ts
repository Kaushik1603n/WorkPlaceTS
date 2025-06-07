import { Types } from "mongoose";

interface Client {
  _id?: Types.ObjectId;
  // Add more fields if you populate `clientId` later
}

interface Job {
  _id?: Types.ObjectId;
  clientId?: Types.ObjectId | Client;
  Attachments?: any[];
  __v?: number;
  budget?: number;
  budgetType?: string;
  createdAt?: Date;
  description?: string;
  experienceLevel?: string;
  proposals?: Types.ObjectId[];
  reference?: string;
  requiredFeatures?: string;
  skills?: string[];
  stack?: string;
  status?: string;
  time?: string;
  title?: string;
  updatedAt?: Date;
  visibility?: string;
}

interface Freelancer {
  _id?: Types.ObjectId;
  fullName?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  status?: string;
  socialLogins?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  googleId?: string;
  isVerification?: string;
}

interface Milestone {
  _id?: Types.ObjectId;
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: Date;
  status?: string;
}

export interface ProposalResponse {
  _id?: Types.ObjectId;
  freelancerId?: Freelancer;
  jobId?: Job;
  coverLetter?: string;
  budgetType?: string;
  bidAmount?: number;
  estimatedTime?: number;
  workSamples?: string;
  agreeVideoCall?: boolean;
  agreeNDA?: boolean;
  PortfolioAttachments?: any[];
  milestones?: Milestone[];
  status?: string;
  payments?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
