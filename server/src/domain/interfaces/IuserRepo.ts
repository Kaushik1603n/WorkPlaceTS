import { IUser } from "../types/authTypes";

export interface userRepoI {
  findById(_id: string): Promise<IUser | null>;
  findByIdRefresh(_id: string): Promise<any>
  findByEmail(email: string): Promise<any>;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
  createUser(userData: any): Promise<any>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateRole(userId: string, role: string): Promise<any>;
  updateEmail(userId: string | unknown, email: string): Promise<any>;
  updateName(userId: string | unknown, fullName: string): Promise<any>;
}
