import { UserDTO } from "./UserDTO";

export interface LoginResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
export interface RegisterResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

export interface UserIdDTO {
  userId: string;
}

export interface OtpSendDTO {
  email: string;
  otpSentAt: Date;
}

export interface OtpVerifyDTO {
  isVerified: boolean;
  message: string;
}
