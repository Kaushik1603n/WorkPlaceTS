import { generateTokens } from "../shared/utils/jwt";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../shared/utils/nodemailer/sendOtpEmail";
import { sendPasswordResetOtpEmail } from "../shared/utils/nodemailer/sendPasswordResetOtpEmail";
import mongoose from "mongoose";
import {
  LoginResponseDTO,
  RegisterResponseDTO,
  UserDataType,
  UserIdDTO,
} from "../domain/dto/AuthDTO";
import { UserDTO } from "../domain/dto/UserDTO";
import { sendEmailChangeOtp } from "../shared/utils/nodemailer/sendEmailChangeOtp";
import { userRepoI } from "../domain/interfaces/IuserRepo";
import { Messages } from "../interfaceAdapters/controllers/messages";

export class AuthUseCase {
  constructor(private user: userRepoI) {
    this.user = user;
  }

  async login(email: string, password: string): Promise<LoginResponseDTO> {
    if (!email || !password) {
      throw new Error(Messages.EMAIL_PASSWORD_REQUIRED);
    }

    const user = await this.user.findByEmail(email);
    if (!user) throw new Error(Messages.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(Messages.INVALID_CREDENTIALS);

    const { accessToken, refreshToken } = generateTokens(user._id, user.email);
    await this.user.storeRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    } as LoginResponseDTO;
  }

  async googleCallback(id: string, email: string) {
    const { accessToken, refreshToken } = generateTokens(id, email);

    await this.user.storeRefreshToken(id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUser(id: string, role: string): Promise<UserDTO> {
    const userData = await this.user.updateRole(id, role);

    return {
      id: userData?._id,
      fullName: userData?.fullName,
      email: userData?.email,
      role: userData?.role,
    } as UserDTO;
  }

  async registerUser(
    joinAs: string,
    fullName: string,
    email: string,
    password: string
  ): Promise<UserIdDTO> {
    const existingUser = await this.user.findByEmail(email);
    if (existingUser) {
      throw new Error(Messages.USER_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.user.createUser({
      role: joinAs,
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
    });

    if(!user){
      throw new Error("Cannot create new User");
    }

    await sendOtpEmail(email, fullName, otp);

    return { userId: user._id } as UserIdDTO;
  }

  async verifyOtp(_id: string, otp: Number): Promise<RegisterResponseDTO> {
    const user = await this.user.findById(_id);

    if (!user) {
      throw new Error(Messages.INVALID_USER);
    }

    if (!user.otpExpiry) throw new Error("User otp Expired");

    if (Number(user.otp) !== Number(otp)) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > new Date(user.otpExpiry)) {
      throw new Error("OTP has expired");
    }

    const updatedUser = await this.user.findByIdAndUpdate(user._id);

    const { accessToken, refreshToken } = generateTokens(
      updatedUser._id,
      updatedUser.email
    );
    await this.user.storeRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    } as RegisterResponseDTO;
  }

  async resendOtp(_id: string): Promise<UserIdDTO> {
    const user = await this.user.findById(_id);

    if (!user) {
      throw new Error(Messages.INVALID_USER);
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const updatedUser = await this.user.findByIdAndUpdateWithOtp(
      user._id,
      otp,
      otpExpiry
    );

    await sendOtpEmail(updatedUser.email, updatedUser.fullName, otp.toString());
    return { userId: user._id } as UserIdDTO;
  }

  async forgotPass(email: string): Promise<UserIdDTO> {
    const user = await this.user.findByEmail(email);
    if (!user) throw new Error(Messages.INVALID_USER);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const updatedUser = await this.user.findByIdAndUpdateWithOtp(
      user._id,
      otp,
      otpExpiry
    );

    await sendPasswordResetOtpEmail(
      email,
      updatedUser.fullName,
      otp.toString()
    );

    return { userId: user._id } as UserIdDTO;
  }

  async resetPassVerifyOtp(userId: string, otp: number): Promise<UserIdDTO> {
    const user = await this.user.findById(userId);
    if (!user) throw new Error(Messages.INVALID_USER);
    if (!user.otpExpiry) throw new Error("User otp Invalid");

    if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
      throw new Error("Invalid or expired OTP");
    }

    return { userId: user._id } as UserIdDTO;
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<UserIdDTO> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.user.findById(userId);
    if (!user) throw new Error(Messages.INVALID_USER);
    if (!user.password) throw new Error("Password not found");

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      throw new Error("New password must be different");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.user.updatePassword(userId, hashedPassword);

    return { userId: user._id } as UserIdDTO;
  }

  async changePasswordUseCase(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<UserIdDTO> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.user.findById(userId);
    if (!user) throw new Error(Messages.INVALID_USER);
    if (!user.password) throw new Error("Password not found");

    const matchPass = await bcrypt.compare(currentPassword, user.password);

    if (!matchPass) {
      throw new Error("Current Passwords do not match");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      throw new Error("New password must be different");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.user.updatePassword(userId, hashedPassword);

    return { userId: user._id } as UserIdDTO;
  }

  async changeEmailUseCase(userId: string, email: string): Promise<UserIdDTO> {
    const user = await this.user.findByEmail(email);
    if (user) throw new Error(Messages.USER_EXISTS);

    const userData = await this.user.findById(userId);
    if (!userData) throw new Error("Current user not found");

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

     const updatedUser = await this.user.findByIdAndUpdateWithOtp(
      userData._id,
      otp,
      otpExpiry
    );

    await sendEmailChangeOtp(email, updatedUser.fullName, otp.toString());

    return { userId: userData._id } as UserIdDTO;
  }

  async changeEmailOtpUseCase(
    userId: string,
    email: string,
    otp: number
  ): Promise<UserDTO> {
    const user = await this.user.findById(userId);
    if (!user) throw new Error(Messages.INVALID_USER);

    const userVerify = await this.user.findByEmail(email);
    if (userVerify) throw new Error(Messages.USER_EXISTS);
    if (!user.otpExpiry) throw new Error("otp Invalid");

    if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
      throw new Error("Invalid or expired OTP");
    }

    const userData = await this.user.updateEmail(userId, email);
    if (!userData) throw new Error("User Email Cannot Update");

    return {
      id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
    } as UserDTO;
  }

  async refresh(
    userId: string,
    checkRefreshToken: string
  ): Promise<LoginResponseDTO> {
    const user = await this.user.findByIdRefresh(userId);

    if (!user || user.refreshToken !== checkRefreshToken) {
      throw new Error("Invalid refresh token");
    }
    const { accessToken, refreshToken } = generateTokens(userId, user.email);

    await this.user.storeRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    } as LoginResponseDTO;
  }

  async logout(userId: string): Promise<void> {
    await this.user.clearRefreshToken(userId);
  }

  async getUserDetails(userId: string | unknown): Promise<UserDataType> {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }
    const user = await this.user.findById(userId);
    if (!user) {
      throw new Error("Already Does Not Exists");
    }
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      isVerification: user.isVerification,
      createdAt: user.createdAt,
    };
  }
}
