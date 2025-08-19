import { RequestHandler } from "express";
import mongoose from "mongoose";
import { verifyRefreshToken } from "../../shared/utils/jwt";
import { IAuthUseCase } from "../../useCase/Interface/IAuthUseCase";
import { HttpStatus } from "./statusCode";
import { Messages } from "./messages";

export class AuthControllers {
  private useCase: IAuthUseCase;
  constructor(usecase: IAuthUseCase) {
    this.useCase = usecase;
  }

  login: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error(Messages.EMAIL_PASSWORD_REQUIRED);
      }
      const { user, accessToken, refreshToken } = await this.useCase.login(
        email,
        password
      );

      if (!user) throw new Error(Messages.INVALID_CREDENTIALS);

      res.cookie("accessToken", accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(HttpStatus.CREATED).json({ success: true, user, accessToken });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  register: RequestHandler = async (req, res) => {
    const { joinAs, fullName, email, password } = req.body;
    if (!joinAs || !fullName || !email || !password) {
      throw new Error(Messages.MISSING_DETAILS);
    }
    try {
      const result = await this.useCase.registerUser(
        joinAs,
        fullName,
        email,
        password
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.OTP_SENT,
        userId: result.userId,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  verifyOtp: RequestHandler = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new Error(Messages.ID_OTP);
    }

    try {
      const result = await this.useCase.verifyOtp(userId, otp);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
        sameSite: "strict",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "OTP verified successfully",
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  resendOtp: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      throw new Error(Messages.INVALID_USERID);
    }

    try {
      const result = await this.useCase.resendOtp(userId);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.OTP_SENT_TO_EMAIL,
        userId: result,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  forgotPass: RequestHandler = async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        throw new Error(Messages.EMAIL_REQUIRED);
      }

      const result = await this.useCase.forgotPass(email);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.OTP_SENT_TO_EMAIL,
        userId: result.userId,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  resetPassVerifyOtp: RequestHandler = async (req, res) => {
    const { userId, otp } = req.body;
    try {
      if (!userId || !otp) {
        throw new Error(Messages.ID_OTP);
      }
      const result = await this.useCase.resetPassVerifyOtp(userId, otp);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.OTP_SENT_TO_EMAIL,
        userId: result.userId,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  resetPassword: RequestHandler = async (req, res) => {
    const { userId, newPassword, confirmPassword } = req.body;
    try {
      if (!userId || !newPassword || !confirmPassword) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.ALL_FIELD });
        return;
      }
      if (newPassword !== confirmPassword) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Passwords do not match" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
        return;
      }

      await this.useCase.changePassword(userId, newPassword);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      const statusCode =
        error.message === Messages.INVALID_USER
          ? 404
          : error.message === "New password must be different"
          ? 409
          : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  };
  changePassword: RequestHandler = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    try {
      if (!req.user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER });
        return;
      }

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_USERID });
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.ALL_FIELD });
        return;
      }
      if (newPassword !== confirmPassword) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Passwords do not match" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
        return;
      }

      await this.useCase.changePasswordUseCase(
        userId,
        currentPassword,
        newPassword
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      const statusCode =
        error.message === Messages.INVALID_USER
          ? 404
          : error.message === "New password must be different"
          ? 409
          : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  };

  changeEmail: RequestHandler = async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        throw new Error(Messages.EMAIL_REQUIRED);
      }

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_USERID });
        return;
      }

      const result = await this.useCase.changeEmailUseCase(userId, email);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.OTP_SENT_TO_EMAIL,
        userId: result.userId,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  emailVerificationOtp: RequestHandler = async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_USERID });
        return;
      }

      if (!otp || !email) {
        throw new Error(Messages.EMAIL_OTP_REQUIRED);
      }

      const result = await this.useCase.changeEmailOtpUseCase(
        userId,
        email,
        otp
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Email Change successfully",
        user: result,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  googleCallback: RequestHandler = async (req, res) => {
    const user = req.user as any;

    if (!user) {
      throw new Error(Messages.INVALID_USER);
    }
    try {
      const { accessToken, refreshToken } = await this.useCase.googleCallback(
        user._id,
        user.email
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.redirect(
        `${process.env.CLIENT_URL}/success-login?accessToken=${accessToken}`
      );
    } catch (error) {
      console.error("error during google callback", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error during google login" });
    }
  };

  getUser: RequestHandler = async (req, res) => {
    try {
      if (!req.user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      res.json({ user: req.user });
    } catch (error) {
      console.error("error during get user", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error during get user" });
    }
  };

  getUserDetails: RequestHandler = async (req, res) => {
    try {
      if (!req.user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const userId = "userId" in req.user ? req.user.userId : req.user;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_USERID });
        return;
      }

      try {
        const result = await this.useCase.getUserDetails(userId);
        res.status(HttpStatus.CREATED).json({ success: true, user: result });
      } catch (error) {}
    } catch (error) {
      console.error("error during get user", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error during get user" });
    }
  };

  userRole: RequestHandler = async (req, res) => {
    try {
      const { role } = req.body;
      const userId = (req.user as any).userId;

      const user = await this.useCase.getUser(userId, role);

      const { accessToken, refreshToken } = await this.useCase.googleCallback(
        userId,
        user.email
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res
        .status(HttpStatus.CREATED)
        .json({ message: "User role updated", user: user, accessToken });
    } catch (error) {
      console.error("error during update role", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error during update role" });
    }
  };

  refresh: RequestHandler = async (req, res) => {
    try {
      const checkRefreshToken = req.cookies?.refreshToken;
      if (!checkRefreshToken) {
        res.clearCookie("accessToken", {
          httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
          httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Your session has expired. Please login again.",
          shouldLogout: true,
        });
        return;
      }

      const decoded = verifyRefreshToken(checkRefreshToken);

      const { accessToken, refreshToken } = await this.useCase.refresh(
        decoded.userId,
        checkRefreshToken
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(HttpStatus.CREATED).json({ success: true, accessToken });
    } catch (error: any) {
      if (error.message === "Invalid refresh token") {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Your session has expired.",
          shouldLogout: true,
        });
        return;
      }
      console.error("Refresh Tocken Error", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server " });
    }
  };

  logout: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    try {
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.INVALID_USERID });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      await this.useCase.logout(userId);

      res.clearCookie("accessToken", {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: "Logged out successfully" });
      return;
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Logout failed" });
      return;
    }
  };
}
