import { LoginResponseDTO, RegisterResponseDTO, UserDataType, UserIdDTO } from "../../domain/dto/AuthDTO";
import { UserDTO } from "../../domain/dto/UserDTO";

export interface IAuthUseCase {
  login(email: string, password: string): Promise<LoginResponseDTO>;
  googleCallback(id: string, email: string): Promise<any>;
  getUser(id: string, role: string): Promise<UserDTO>;
  registerUser(
    joinAs: string,
    fullName: string,
    email: string,
    password: string
  ): Promise<UserIdDTO>;
  verifyOtp(_id: string, otp: Number): Promise<RegisterResponseDTO>;
  resendOtp(_id: string): Promise<UserIdDTO>;
  forgotPass(email: string): Promise<UserIdDTO>;
  resetPassVerifyOtp(userId: string, otp: number): Promise<UserIdDTO>;
  changePassword(userId: string, newPassword: string): Promise<UserIdDTO>;
  changePasswordUseCase(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<UserIdDTO>;
  changeEmailUseCase(userId: string, email: string): Promise<UserIdDTO>;
  changeEmailOtpUseCase(
    userId: string,
    email: string,
    otp: number
  ): Promise<UserDTO>;
  refresh(userId: string, checkRefreshToken: string): Promise<LoginResponseDTO>;
  logout(userId: string): Promise<void>;
  getUserDetails(userId: string | unknown): Promise<UserDataType>;
}
