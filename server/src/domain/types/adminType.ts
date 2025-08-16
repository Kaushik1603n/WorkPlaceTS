import { IJob } from "../models/Projects";
import { Types } from "mongoose";

export interface AdminPaginatedProjects {
  result: IJob[];
  totalPage: number;
}

export interface FreelancerRatings {
  avgQuality: number;
  avgDeadlines: number;
  avgProfessionalism: number;
}

export interface ClientRatings {
  avgClarity: number;
  avgPayment: number;
  avgCommunication: number;
}

export interface IAdminUser {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  status: string;
  socialLogins: string[];
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  isVerification?: "pending" | "verified" | "false";
  otp?: number;
  otpExpiry?: Date;
  avgRating?: number;
  feedbackCount?: number;
  freelancerRatings: FreelancerRatings;
  clientRatings: ClientRatings;
  id: string;
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface IAdminFreelancerWithPagination {
  freelancer: IAdminUser[];
  pagination: Pagination;
}
export interface IAdminClinetWithPagination {
  client: IAdminUser[];
  pagination: Pagination;
}
export interface IAdminUsersWithPagination {
  users: IAdminUser[];
  pagination: Pagination;
}

export enum verification {
  FALSE = "false",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}
export interface IUserProfileResult {
  id?: string;
  name?: string;
  email?: string;
  isVerification?: verification;
  profile?: string;
  cover?: string;
  companyName?: string;
  location?: string;
  website?: string;
  description?: string;
  role?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserFreelancerProfileResult {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  isVerification?: verification;
  createdAt?: Date;
  profile?: string;
  cover?: string;
  availability?: string;
  experienceLevel?: string;
  education?: string;
  hourlyRate?: number;
  skills?: string[];
  location?: string;
  reference?: string;
  description?: string;
  updatedAt?: Date;
}

enum ReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REJECTED = "rejected",
}
export interface IComment {
  text: string;
  user: string;
  createdAt: Date;
  createdBy: Types.ObjectId | string;
}

export interface IClientInfo {
  id: Types.ObjectId | string;
  email: string;
}

export interface IReport {
  _id: Types.ObjectId;
  title: string;
  description: string;
  reportedBy: Types.ObjectId | string;
  client: IClientInfo;
  comments: IComment[];
  status: ReportStatus;
  jobId: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionDetails?: string;
  __v?: number;
}

export interface IReportWithPagination {
  result: IReport[];
  totalPages: number;
}

export interface IUserStatsByWeek {
  week: string;
  freelancers: number;
  clients: number;
}

export interface IUserStatsResponse {
  result: IUserStatsByWeek[];
  totalUsers: number;
}

export interface ITopFreelancerRating {
  userId: string;
  fullName: string;
  email: string;
  averageRating: number;
  averageQuality: number;
  averageDeadlines: number;
  averageProfessionalism: number;
  feedbackCount: number;
}

export interface AdminJobStats {
  jobsPosted: number;
  hiresMade: number;
  month: string;
  monthNumber: number;
}
[];

export interface AdminJobSummary {
  successRate: string;
  avgBudget: number;
  completedJob: number;
  totalJob: number;
  activeJob: number;
}

export interface AdminRevenueReport {
  revenueData: {
    week: string;
    platformFee: number;
    dateRange: string;
  }[];
  revenueDetails: {
    revenue?: number;
    pending: number;
    wallet?: number;
  };
}

export interface AdminIPayment {
  _id: string;
  jobId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentGatewayId: string;
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
