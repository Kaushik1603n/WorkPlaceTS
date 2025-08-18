import { Types } from "mongoose";
import {
  ICreatedUser,
  UserDataReturnType,
  UserRefreshDTO,
} from "../../../domain/dto/AuthDTO";
import { userRepoI } from "../../../domain/interfaces/IuserRepo";
import UserModel from "../../../domain/models/User";

export class UserRepo implements userRepoI {
  async findById(_id: string): Promise<UserDataReturnType | null> {
    const result = await UserModel.findById(new Types.ObjectId(_id)).lean();

    if (!result) return null;

    const mappedUser: UserDataReturnType = {
      _id: result._id.toString(),
      fullName: result.fullName,
      email: result.email,
      password: result.password ?? "",
      role: result.role,
      isVerified: result.isVerified,
      isVerification: result.isVerification,
      otp: result.otp,
      otpExpiry: result.otpExpiry,
      refreshToken: result.refreshToken,
      googleId: result.googleId,
      pic: result.pic,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return mappedUser;
  }

  async findByIdAndUpdate(_id: string): Promise<UserDataReturnType> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        isVerified: true,
        otp: undefined,
        otpExpiry: undefined,
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return {
      _id: updatedUser._id.toString(),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      password: updatedUser.password ?? "",
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      isVerification: updatedUser.isVerification,
      otp: updatedUser.otp,
      otpExpiry: updatedUser.otpExpiry,
      refreshToken: updatedUser.refreshToken,
      googleId: updatedUser.googleId,
      pic: updatedUser.pic,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async findByIdAndUpdateWithOtp(
    _id: string,
    otp: number,
    otpExpiry: Date
  ): Promise<UserDataReturnType> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { otp, otpExpiry },
      { new: true } // return updated document
    ).lean();

    if (!updatedUser) {
      throw new Error("Failed to update user OTP");
    }

    return {
      _id: updatedUser._id.toString(),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      password: updatedUser.password ?? "",
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      isVerification: updatedUser.isVerification,
      otp: updatedUser.otp,
      otpExpiry: updatedUser.otpExpiry,
      refreshToken: updatedUser.refreshToken,
      googleId: updatedUser.googleId,
      pic: updatedUser.pic,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async findByIdRefresh(_id: string): Promise<UserRefreshDTO | null> {
    const result = await UserModel.findById(_id, {
      _id: 1,
      email: 1,
      role: 1,
      fullName: 1,
      isVerification: 1,
      refreshToken: 1,
      createdAt: 1,
    }).lean<UserRefreshDTO | null>();

    if (!result) return null;

    const mapped: UserRefreshDTO = {
      _id: result._id.toString(),
      email: result.email,
      role: result.role,
      fullName: result.fullName,
      isVerification: result.isVerification,
      refreshToken: result.refreshToken ?? null,
      createdAt: result.createdAt,
    };

    return mapped;
  }

  async findByEmail(email: string): Promise<UserDataReturnType | null> {
    const result = await UserModel.findOne({ email });

    if (!result) return null;

    const mappedUser: UserDataReturnType = {
      _id: result._id.toString(),
      fullName: result.fullName,
      email: result.email,
      password: result.password ?? "",
      role: result.role,
      isVerified: result.isVerified,
      isVerification: result.isVerification,
      otp: result.otp,
      otpExpiry: result.otpExpiry,
      refreshToken: result.refreshToken,
      googleId: result.googleId,
      pic: result.pic,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return mappedUser;
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async createUser(userData: any): Promise<ICreatedUser | null> {
    const result = await UserModel.create(userData);

    if (!result) return null;

    const mappedUser = {
      _id: result._id.toString(),
      fullName: result.fullName,
      email: result.email,
      role: result.role,
    };

    return mappedUser;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      otp: undefined,
      otpExpiry: undefined,
    });
  }

  async updateRole(userId: string, role: string): Promise<ICreatedUser | null> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!result) return null;

    const mappedUser = {
      _id: result._id.toString(),
      fullName: result.fullName,
      email: result.email,
      role: result.role,
    };

    return mappedUser;
  }

  async updateEmail(userId: string , email: string): Promise<ICreatedUser | null> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );
     if (!result) return null;

    const mappedUser = {
      _id: result._id.toString(),
      fullName: result.fullName,
      email: result.email,
      role: result.role,
    };

    return mappedUser;
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
