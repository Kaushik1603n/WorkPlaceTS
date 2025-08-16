export interface IAuthUseCase {
  login(email: string, password: string): Promise<any>;
  googleCallback(id: string, email: string): Promise<any>;
  getUser(id: string, role: string): Promise<any>;
  registerUser(
    joinAs: string,
    fullName: string,
    email: string,
    password: string
  ): Promise<any>;
  verifyOtp(_id: string, otp: Number): Promise<any>;
  resendOtp(_id: string): Promise<any>;
  forgotPass(email: string): Promise<any>;
  resetPassVerifyOtp(userId: string, otp: number): Promise<any>;
  changePassword(userId: string, newPassword: string): Promise<any>;
  changePasswordUseCase(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any>;
  changeEmailUseCase(userId: string, email: string): Promise<any>;
  changeEmailOtpUseCase(
    userId: string,
    email: string,
    otp: number
  ): Promise<any>;
  refresh(userId: string, checkRefreshToken: string): Promise<any>;
  logout(userId: string): Promise<any>;
  getUserDetails(userId: string | unknown): Promise<any>;
}
