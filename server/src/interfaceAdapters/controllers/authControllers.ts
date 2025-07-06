import { RequestHandler } from "express";
import { AuthUseCase } from "../../useCase/authUseCase";
import { UserRepo } from "../../infrastructure/repositories/implementations/userRepo";
import mongoose from "mongoose";
import { verifyRefreshToken } from "../../shared/utils/jwt";

const user = new UserRepo();
const useCase = new AuthUseCase(user);

export class AuthControllers {
  login: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const { user, accessToken, refreshToken } = await useCase.login(
        email,
        password
      );

      if (!user) throw new Error("Invalid credentials");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json({ success: true, user, accessToken });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  register: RequestHandler = async (req, res) => {
    const { joinAs, fullName, email, password } = req.body;
    if (!joinAs || !fullName || !email || !password) {
      throw new Error("Missing details");
    }
    try {
      const result = await useCase.registerUser(
        joinAs,
        fullName,
        email,
        password
      );

      res.status(201).json({
        success: true,
        message:
          "OTP sent to your email. Please verify to complete registration.",
        userId: result.userId,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  verifyOtp: RequestHandler = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new Error("User ID and OTP are required");
    }

    try {
      const result = await useCase.verifyOtp(userId, otp);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  resendOtp: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User ID not found");
    }

    try {
      const result = await useCase.resendOtp(userId);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
        userId: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });

      // res.status(500).json({
      //   success: false,
      //   message: "Something went wrong while resending OTP",
      //   error: error instanceof Error ? error.message : error,
      // });
      // return;
    }
  };

  forgotPass: RequestHandler = async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const result = await useCase.forgotPass(email);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
        userId: result.userId,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  resetPassVerifyOtp: RequestHandler = async (req, res) => {
    const { userId, otp } = req.body;
    try {
      if (!userId || !otp) {
        throw new Error("User ID and OTP are required");
      }
      const result = await useCase.resetPassVerifyOtp(userId, otp);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
        userId: result.userId,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  resetPassword: RequestHandler = async (req, res) => {
    const { userId, newPassword, confirmPassword } = req.body;
    try {
      if (!userId || !newPassword || !confirmPassword) {
        res
          .status(400)
          .json({ success: false, message: "All fields are required" });
        return;
      }
      if (newPassword !== confirmPassword) {
        res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
        return;
      }

      await useCase.changePassword(userId, newPassword);
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      const statusCode =
        error.message === "User not found"
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
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        res
          .status(400)
          .json({ success: false, message: "All fields are required" });
        return;
      }
      if (newPassword !== confirmPassword) {
        res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
        return;
      }

      await useCase.changePasswordUseCase(userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      const statusCode =
        error.message === "User not found"
          ? 404
          : error.message === "New password must be different"
          ? 409
          : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  };

  changeEmail: RequestHandler = async (req, res) => {
    console.log("jdbdbsbjsdbj");

    const { email } = req.body;
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      const result = await useCase.changeEmailUseCase(userId, email);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
        userId: result.userId,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  emailVerificationOtp: RequestHandler = async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      if (!otp || !email) {
        throw new Error("Email and OTP are required");
      }

      const result = await useCase.changeEmailOtpUseCase(userId, email, otp);
      res.status(200).json({
        success: true,
        message: "Email Change successfully",
        user: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  googleCallback: RequestHandler = async (req, res) => {
    const user = req.user as any;

    if (!user) {
      throw new Error("User Details required");
    }
    try {
      const { accessToken, refreshToken } = await useCase.googleCallback(
        user._id,
        user.email
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.redirect(
        `https://mapplestore.shop/success-login?accessToken=${accessToken}`
      );
    } catch (error) {
      console.error("error during google callback", error);
      res
        .status(500)
        .json({ message: "internal server error during google login" });
    }
  };

  getUser: RequestHandler = async (req, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }
      res.json({ user: req.user });
    } catch (error) {
      console.error("error during get user", error);
      res
        .status(500)
        .json({ message: "internal server error during get user" });
    }
  };

  getUserDetails: RequestHandler = async (req, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }
      const userId = "userId" in req.user ? req.user.userId : req.user;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      try {
        const result = await useCase.getUserDetails(userId);
        res.status(200).json({ success: true, user: result });
      } catch (error) {}
    } catch (error) {
      console.error("error during get user", error);
      res
        .status(500)
        .json({ message: "internal server error during get user" });
    }
  };
  userRole: RequestHandler = async (req, res) => {
    try {
      const { role } = req.body;
      const userId = (req.user as any).userId;

      const { user } = await useCase.getUser(userId, role);

        const { accessToken, refreshToken } = await useCase.googleCallback(
        userId,
        user.email
      );
      
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json({ message: "User role updated", user: user,accessToken });
    } catch (error) {
      console.error("error during update role", error);
      res
        .status(500)
        .json({ message: "internal server error during update role" });
    }
  };

  refresh: RequestHandler = async (req, res) => {
    try {
      const checkRefreshToken = req.cookies?.refreshToken;
      if (!checkRefreshToken) {
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.status(401).json({
          success: false,
          message: "Your session has expired. Please login again.",
          shouldLogout: true,
        });
        return;
      }

      const decoded = verifyRefreshToken(checkRefreshToken);

      const { accessToken, refreshToken } = await useCase.refresh(
        decoded.userId,
        checkRefreshToken
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      console.error("error during update role", error);
      res
        .status(500)
        .json({ message: "internal server error during update role" });
    }
  };

  logout: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    try {
      if (!userId) {
        res.status(400).json({ success: false, message: "userId required" });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      await useCase.logout(userId);

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Logout failed" });
      return;
    }
  };
}
