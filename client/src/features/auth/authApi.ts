import axiosClient from "../../utils/axiosClient";
import type {
  ForgotResponse,
  LoginResponse,
  registerResponse,
  VerifyResponse,
} from "./authSlice";

// Define types for your data structures
interface UserData {
  joinAs: string;
  fullName: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface VerifyEmailArgs {
  otp: string;
  userId: string | null;
}

interface Email {
  email: string;
}

interface Otp {
  otp: string;
  userId: string | null;
}

interface UserId {
  userId: string | null;
}

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  userId: string | null;
}
interface changePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ChangePassResponse {
  success: boolean,
  message: string;
  // any other fields you expect in the response
}

export const authApi = {
  register: <T = registerResponse>(userData: UserData) =>
    axiosClient.post<T>("/auth/register", userData),
  login: <T = LoginResponse>(credentials: Credentials) =>
    axiosClient.post<T>("/auth/login", credentials),
  verifyEmail: <T = VerifyResponse>(credentials: VerifyEmailArgs) =>
    axiosClient.post<T>("/auth/verify-otp", credentials),
  reSentOtp: <T = { message: string }>(userId: UserId) =>
    axiosClient.post<T>("/auth/resend-otp", userId),
  forgotPassword: <T = ForgotResponse>(email: Email) =>
    axiosClient.post<T>("/auth/forgot-password", email),
  passOtp: <T = { userId: string }>(otp: Otp) =>
    axiosClient.post<T>("/auth/verify-reset-otp", otp),
  resetPassword: <T = { email: string }>(data: ResetPasswordData) =>
    axiosClient.post<T>("/auth/reset-password", data),
  roleUpdate: <T = LoginResponse>(credentials: { role: string }) =>
    axiosClient.post<T>("/auth/set-role", credentials),
  fetchUser: <T = LoginResponse>() => axiosClient.get<T>("/auth/user"),
  getUserDetails: <T = LoginResponse>() =>
    axiosClient.get<T>("/auth/get-user-details"),
  changepass: <T=ChangePassResponse>(credentials: changePasswordData) =>
    axiosClient.put<T>("/auth/changePass", credentials),
  logout: <T>() => axiosClient.post<T>("/auth/logout"),
};
