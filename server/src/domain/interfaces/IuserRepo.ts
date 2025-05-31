export interface userRepoI {
  findById(_id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<any>;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
  createUser(userData: any): Promise<any>;
}

export interface IUser {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  otp?: number;
  otpExpiry?: Date;
  refreshToken?: string|null;
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
