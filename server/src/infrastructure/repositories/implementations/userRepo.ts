import { userRepoI } from "../../../domain/interfaces/IuserRepo";
import UserModel from "../../../domain/models/User";

export class UserRepo implements userRepoI {
  async findById(_id: string): Promise<any> {
    const result = await UserModel.findById(_id, {
      _id: 1,
      email: 1,
      role: 1,
      fullName: 1,
      isVerification: 1,
      createdAt: 1,
    });
    return result;
  }
  async findByEmail(email: string): Promise<any> {
    const result = await UserModel.findOne({ email });
    return result;
  }
  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async createUser(userData: any): Promise<any> {
    return await UserModel.create(userData);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      otp: undefined,
      otpExpiry: undefined,
    });
  }

  async updateRole(userId: string, role: string): Promise<any> {
    return await UserModel.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async updateEmail(userId: string | unknown, email: string): Promise<any> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );
    return result;
  }
  async updateName(userId: string | unknown, fullName: string): Promise<any> {
    const user = await UserModel.findById(userId, {
      isVerification: 1,
      fullName: 1,
      email: 1,
    });
    const status = user?.isVerification === "verified" ? "verified" : "pending";
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { fullName, isVerification: status },
      { new: true }
    );
    return result;
  }
}
