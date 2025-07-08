import { UserRepo } from "../infrastructure/repositories/implementations/userRepo";
import { generateTokens } from "../shared/utils/jwt";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../shared/utils/nodemailer/sendOtpEmail";
import { sendPasswordResetOtpEmail } from "../shared/utils/nodemailer/sendPasswordResetOtpEmail";
import mongoose from "mongoose";
import {
  LoginResponseDTO,
  RegisterResponseDTO,
  UserIdDTO,
} from "../domain/dto/AuthDTO";
import { UserDTO } from "../domain/dto/UserDTO";
import { sendEmailChangeOtp } from "../shared/utils/nodemailer/sendEmailChangeOtp";

export class AuthUseCase {
  constructor(private user: UserRepo) {
    this.user = user;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await this.user.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

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

  async getUser(id: string, role: string) {
    const userData = await this.user.updateRole(id, role);

    return {
      user: {
        id: userData?._id,
        fullName: userData?.fullName,
        email: userData?.email,
        role: userData?.role,
      } as UserDTO,
    };
  }

  async registerUser(
    joinAs: string,
    fullName: string,
    email: string,
    password: string
  ) {
    const existingUser = await this.user.findByEmail(email);
    if (existingUser) {
      throw new Error("User Already Exists");
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

    await sendOtpEmail(email, fullName, otp);

    return { userId: user._id } as UserIdDTO;
  }

  async verifyOtp(_id: string, otp: Number) {
    const user = await this.user.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    if (Number(user.otp) !== Number(otp)) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > new Date(user.otpExpiry)) {
      throw new Error("OTP has expired");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

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
    } as RegisterResponseDTO;
  }

  async resendOtp(_id: string) {
    const user = await this.user.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(user.email, user.fullName, otp);
    return { userId: user._id } as UserIdDTO;
  }

  async forgotPass(email: string) {
    const user = await this.user.findByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendPasswordResetOtpEmail(email, user.fullName, otp);

    return { userId: user._id } as UserIdDTO;
  }

  async resetPassVerifyOtp(userId: string, otp: number) {
    const user = await this.user.findById(userId);
    if (!user) throw new Error("User not found");

    if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
      throw new Error("Invalid or expired OTP");
    }

    return { userId: user._id } as UserIdDTO;
  }

  async changePassword(userId: string, newPassword: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.user.findById(userId);
    if (!user) throw new Error("User not found");

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
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.user.findById(userId);
    if (!user) throw new Error("User not found");

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

  async changeEmailUseCase(userId: string, email: string) {
    const user = await this.user.findByEmail(email);
    if (user) throw new Error("User already exist");

    const userData = await this.user.findById(userId);
    if (!userData) throw new Error("Current user not found");

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    userData.otp = otp;
    userData.otpExpiry = otpExpiry;
    await userData.save();

    await sendEmailChangeOtp(email, userData.fullName, otp);

    return { userId: userData._id } as UserIdDTO;
  }

  async changeEmailOtpUseCase(userId: string, email: string, otp: number) {
    const user = await this.user.findById(userId);
    if (!user) throw new Error("User not found");

    const userVerify = await this.user.findByEmail(email);
    if (userVerify) throw new Error("User already exist");

    if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
      throw new Error("Invalid or expired OTP");
    }

    const userData = await this.user.updateEmail(userId, email);

    return {
      id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
    } as UserDTO;
  }

  async refresh(userId: string, checkRefreshToken: string) {
    const user = await this.user.findById(userId);

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

  async logout(userId: string) {
    await this.user.clearRefreshToken(userId);
  }
  async getUserDetails(userId: string | unknown) {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }
    const user = await this.user.findById(userId);
    if (!user) {
      throw new Error("Already Does Not Exists");
    }
    return user;
  }

  // async updateNameAndEmail(fullName:string,email:string){
  //   const user = await this.user.findByEmail(email);
  //   // if (!user) throw new Error("Invalid credentials");

  //    if (user.email !== email) {
  //     const emailUsed = await this.user.findByEmail(email);
  //     if (!emailUsed) {
  //       await this.
  //     } else {
  //       return
  //     }
  //   }

  //   const result= await this.user.updateNameAndEmail(fullName,email)
  //   return result;

  // }
}
