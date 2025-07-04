"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const authUseCase_1 = require("../../useCase/authUseCase");
const userRepo_1 = require("../../infrastructure/repositories/implementations/userRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("../../shared/utils/jwt");
const user = new userRepo_1.UserRepo();
const useCase = new authUseCase_1.AuthUseCase(user);
class AuthControllers {
    constructor() {
        Object.defineProperty(this, "login", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email, password } = req.body;
                    if (!email || !password) {
                        throw new Error("Email and password are required");
                    }
                    const { user, accessToken, refreshToken } = yield useCase.login(email, password);
                    if (!user)
                        throw new Error("Invalid credentials");
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
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "register", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { joinAs, fullName, email, password } = req.body;
                if (!joinAs || !fullName || !email || !password) {
                    throw new Error("Missing details");
                }
                try {
                    const result = yield useCase.registerUser(joinAs, fullName, email, password);
                    res.status(201).json({
                        success: true,
                        message: "OTP sent to your email. Please verify to complete registration.",
                        userId: result.userId,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "verifyOtp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { userId, otp } = req.body;
                if (!userId || !otp) {
                    throw new Error("User ID and OTP are required");
                }
                try {
                    const result = yield useCase.verifyOtp(userId, otp);
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
                }
                catch (error) {
                    res.status(400).json({
                        success: false,
                        message: error.message || "Something went wrong",
                    });
                }
            })
        });
        Object.defineProperty(this, "resendOtp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { userId } = req.body;
                if (!userId) {
                    throw new Error("User ID not found");
                }
                try {
                    const result = yield useCase.resendOtp(userId);
                    res.status(200).json({
                        success: true,
                        message: "New OTP sent to your email",
                        userId: result,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                    // res.status(500).json({
                    //   success: false,
                    //   message: "Something went wrong while resending OTP",
                    //   error: error instanceof Error ? error.message : error,
                    // });
                    // return;
                }
            })
        });
        Object.defineProperty(this, "forgotPass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { email } = req.body;
                try {
                    if (!email) {
                        throw new Error("Email is required");
                    }
                    const result = yield useCase.forgotPass(email);
                    res.status(200).json({
                        success: true,
                        message: "New OTP sent to your email",
                        userId: result.userId,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "resetPassVerifyOtp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { userId, otp } = req.body;
                try {
                    if (!userId || !otp) {
                        throw new Error("User ID and OTP are required");
                    }
                    const result = yield useCase.resetPassVerifyOtp(userId, otp);
                    res.status(200).json({
                        success: true,
                        message: "New OTP sent to your email",
                        userId: result.userId,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "resetPassword", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                    yield useCase.changePassword(userId, newPassword);
                    res.status(200).json({
                        success: true,
                        message: "Password updated successfully",
                    });
                }
                catch (error) {
                    const statusCode = error.message === "User not found"
                        ? 404
                        : error.message === "New password must be different"
                            ? 409
                            : 400;
                    res.status(statusCode).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "changePassword", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { currentPassword, newPassword, confirmPassword } = req.body;
                try {
                    if (!req.user) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const user = req.user;
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
                    yield useCase.changePasswordUseCase(userId, currentPassword, newPassword);
                    res.status(200).json({
                        success: true,
                        message: "Password updated successfully",
                    });
                }
                catch (error) {
                    const statusCode = error.message === "User not found"
                        ? 404
                        : error.message === "New password must be different"
                            ? 409
                            : 400;
                    res.status(statusCode).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "changeEmail", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                console.log("jdbdbsbjsdbj");
                const { email } = req.body;
                try {
                    if (!email) {
                        throw new Error("Email is required");
                    }
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(400).json({ message: "User ID not found" });
                        return;
                    }
                    const result = yield useCase.changeEmailUseCase(userId, email);
                    res.status(200).json({
                        success: true,
                        message: "New OTP sent to your email",
                        userId: result.userId,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "emailVerificationOtp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { email, otp } = req.body;
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(400).json({ message: "User ID not found" });
                        return;
                    }
                    if (!otp || !email) {
                        throw new Error("Email and OTP are required");
                    }
                    const result = yield useCase.changeEmailOtpUseCase(userId, email, otp);
                    res.status(200).json({
                        success: true,
                        message: "Email Change successfully",
                        user: result,
                    });
                }
                catch (error) {
                    res.status(400).json({ success: false, message: error.message });
                }
            })
        });
        Object.defineProperty(this, "googleCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.user;
                if (!user) {
                    throw new Error("User Details required");
                }
                try {
                    const { accessToken, refreshToken } = yield useCase.googleCallback(user._id, user.email);
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
                    res.redirect(`${process.env.CLIENT_URL}/success-login?accessToken=${accessToken}`);
                }
                catch (error) {
                    console.error("error during google callback", error);
                    res
                        .status(500)
                        .json({ message: "internal server error during google login" });
                }
            })
        });
        Object.defineProperty(this, "getUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.user) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    res.json({ user: req.user });
                }
                catch (error) {
                    console.error("error during get user", error);
                    res
                        .status(500)
                        .json({ message: "internal server error during get user" });
                }
            })
        });
        Object.defineProperty(this, "getUserDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                        const result = yield useCase.getUserDetails(userId);
                        res.status(200).json({ success: true, user: result });
                    }
                    catch (error) { }
                }
                catch (error) {
                    console.error("error during get user", error);
                    res
                        .status(500)
                        .json({ message: "internal server error during get user" });
                }
            })
        });
        Object.defineProperty(this, "userRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { role } = req.body;
                    const userId = req.user.userId;
                    const { user } = yield useCase.getUser(userId, role);
                    const { accessToken, refreshToken } = yield useCase.googleCallback(userId, user.email);
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
                    res.status(200).json({ message: "User role updated", user: user, accessToken });
                }
                catch (error) {
                    console.error("error during update role", error);
                    res
                        .status(500)
                        .json({ message: "internal server error during update role" });
                }
            })
        });
        Object.defineProperty(this, "refresh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const checkRefreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
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
                    const decoded = (0, jwt_1.verifyRefreshToken)(checkRefreshToken);
                    const { accessToken, refreshToken } = yield useCase.refresh(decoded.userId, checkRefreshToken);
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
                }
                catch (error) {
                    console.error("error during update role", error);
                    res
                        .status(500)
                        .json({ message: "internal server error during update role" });
                }
            })
        });
        Object.defineProperty(this, "logout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { userId } = req.body;
                try {
                    if (!userId) {
                        res.status(400).json({ success: false, message: "userId required" });
                        return;
                    }
                    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                        throw new Error("Invalid user ID");
                    }
                    yield useCase.logout(userId);
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
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Logout failed" });
                    return;
                }
            })
        });
    }
}
exports.AuthControllers = AuthControllers;
//# sourceMappingURL=authControllers.js.map