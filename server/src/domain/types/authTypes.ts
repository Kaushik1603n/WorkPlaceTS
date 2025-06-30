export interface UserType {
  id: string;
  fullName: string;
  email: string;
  role: string;
}
export interface LoginResponseType {
  user: UserType;
  accessToken: string;
  refreshToken: string;
}
export interface RegisterResponseType {
  user: UserType;
  accessToken: string;
  refreshToken: string;
}

export interface UserIdType {
  userId: string;
}

export interface OtpSendType {
  email: string;
  otpSentAt: Date;
}

export interface OtpVerifyType {
  isVerified: boolean;
  message: string;
}

export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  avgRating?: number;
  freelancerRatings?: FreelancerRatingStats;
  clientRatings?: ClientRatingStats;
  otp?: number;
  otpExpiry?: Date;
  refreshToken?: string | null;
  googleId?: string;
  pic?: string;
  status: UserStatus;
  lastLogin?: Date;
  jobs?: any[];
  profile?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum UserRole {
  FREELANCER = "freelancer",
  CLIENT = "client",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export interface FreelancerRatingStats {
  avgQuality: number;
  avgDeadlines: number;
  avgProfessionalism: number;
  feedbackCount: number;
}

export interface ClientRatingStats {
  avgClarity: number;
  avgPayment: number;
  avgCommunication: number;
  feedbackCount: number;
}
