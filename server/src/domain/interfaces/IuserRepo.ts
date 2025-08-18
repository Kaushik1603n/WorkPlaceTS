import { ICreatedUser, UserDataReturnType, UserRefreshDTO } from "../dto/AuthDTO";
// import { IUser } from "../types/authTypes";

export interface userRepoI {
  findById(_id: string): Promise<UserDataReturnType | null>;
  findByIdAndUpdate(_id: string): Promise<UserDataReturnType>;
  findByIdAndUpdateWithOtp(
    _id: string,
    otp: number,
    otpExpiry: Date
  ): Promise<UserDataReturnType>;
  findByIdRefresh(_id: string): Promise<UserRefreshDTO | null>;
  findByEmail(email: string): Promise<UserDataReturnType | null>;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
  createUser(userData: any): Promise<ICreatedUser | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateRole(userId: string, role: string): Promise<ICreatedUser | null>;
  updateEmail(userId: string | unknown, email: string): Promise<ICreatedUser | null>;
  updateName(userId: string | unknown, fullName: string): Promise<any>;
}
