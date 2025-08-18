import { UserDTO } from "./UserDTO";

export interface LoginResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
export interface RegisterResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

export interface UserIdDTO {
  userId: string;
}

export interface OtpSendDTO {
  email: string;
  otpSentAt: Date;
}

export interface OtpVerifyDTO {
  isVerified: boolean;
  message: string;
}
export enum verification {
  FALSE = "false",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}
export interface UserDataType {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerification: verification;
  createdAt: Date;
}

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

export interface SocialLogin {
  provider: SocialProvider;
  providerId: string;
}

export interface UserDataReturnType {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  isVerification: verification;
  otp?: number;
  otpExpiry?: Date;
  refreshToken?: string | null;
  googleId?: string;
  pic?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRefreshDTO {
  _id: string;
  email: string;
  role: string;
  fullName: string;
  isVerification: boolean;
  refreshToken: string | null;
  createdAt: Date;
}

export interface ICreatedUser {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
