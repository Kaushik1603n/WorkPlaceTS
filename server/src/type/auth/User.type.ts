export interface IUser {
  _id?: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
  isVerified?: boolean;
  googleId?: string;
  status?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface IUserDetails {
  _id: string;
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
