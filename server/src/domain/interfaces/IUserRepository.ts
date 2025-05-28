// // src/domain/repositories/IUserRepository.ts
// import { SocialLogin, SocialProvider, User, UserStatus } from "../entities/user";

// export interface IUserRepository {
//   // Basic CRUD
//   create(user: Partial<User>): Promise<User>;
//   findById(id: string): Promise<User | null>;
//   findByEmail(email: string): Promise<User | null>;
//   update(id: string, user: Partial<User>): Promise<User | null>;
//   delete(id: string): Promise<boolean>;
  
//   // Auth-related
//   findByGoogleId(googleId: string): Promise<User | null>;
//   findByRefreshToken(refreshToken: string): Promise<User | null>;
//   updateRefreshToken(id: string, refreshToken: string | null): Promise<User | null>;
  
//   // Verification
//   updateVerificationStatus(id: string, isVerified: boolean): Promise<User | null>;
//   updateOtp(id: string, otp: number | null, otpExpiry: Date | null): Promise<User | null>;
  
//   // Status management
//   updateStatus(id: string, status: UserStatus): Promise<User | null>;
//   updateLastLogin(id: string): Promise<User | null>;
  
//   // Social logins
//   addSocialLogin(id: string, socialLogin: SocialLogin): Promise<User | null>;
//   removeSocialLogin(id: string, provider: SocialProvider): Promise<User | null>;
// }