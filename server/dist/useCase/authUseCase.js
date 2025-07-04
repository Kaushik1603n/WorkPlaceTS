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
exports.AuthUseCase = void 0;
const jwt_1 = require("../shared/utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendOtpEmail_1 = require("../shared/utils/nodemailer/sendOtpEmail");
const sendPasswordResetOtpEmail_1 = require("../shared/utils/nodemailer/sendPasswordResetOtpEmail");
const mongoose_1 = __importDefault(require("mongoose"));
const sendEmailChangeOtp_1 = require("../shared/utils/nodemailer/sendEmailChangeOtp");
class AuthUseCase {
    constructor(user) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        this.user = user;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                throw new Error("Email and password are required");
            }
            const user = yield this.user.findByEmail(email);
            if (!user)
                throw new Error("Invalid credentials");
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                throw new Error("Invalid credentials");
            const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id, user.email);
            yield this.user.storeRefreshToken(user._id, refreshToken);
            return {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        });
    }
    googleCallback(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(id, email);
            yield this.user.storeRefreshToken(id, refreshToken);
            return {
                accessToken,
                refreshToken,
            };
        });
    }
    getUser(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.user.updateRole(id, role);
            return {
                user: {
                    id: userData === null || userData === void 0 ? void 0 : userData._id,
                    fullName: userData === null || userData === void 0 ? void 0 : userData.fullName,
                    email: userData === null || userData === void 0 ? void 0 : userData.email,
                    role: userData === null || userData === void 0 ? void 0 : userData.role,
                },
            };
        });
    }
    registerUser(joinAs, fullName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.user.findByEmail(email);
            if (existingUser) {
                throw new Error("User Already Exists");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
            const user = yield this.user.createUser({
                role: joinAs,
                fullName,
                email,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpExpiry,
            });
            yield (0, sendOtpEmail_1.sendOtpEmail)(email, fullName, otp);
            return { userId: user._id };
        });
    }
    verifyOtp(_id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(_id);
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
            yield user.save();
            const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id, user.email);
            yield this.user.storeRefreshToken(user._id, refreshToken);
            return {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        });
    }
    resendOtp(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(_id);
            if (!user) {
                throw new Error("User not found");
            }
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            yield user.save();
            yield (0, sendOtpEmail_1.sendOtpEmail)(user.email, user.fullName, otp);
            return { userId: user._id };
        });
    }
    forgotPass(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findByEmail(email);
            if (!user)
                throw new Error("User not found");
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            yield user.save();
            yield (0, sendPasswordResetOtpEmail_1.sendPasswordResetOtpEmail)(email, user.fullName, otp);
            return { userId: user._id };
        });
    }
    resetPassVerifyOtp(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(userId);
            if (!user)
                throw new Error("User not found");
            if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
                throw new Error("Invalid or expired OTP");
            }
            return { userId: user._id };
        });
    }
    changePassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid user ID");
            }
            const user = yield this.user.findById(userId);
            if (!user)
                throw new Error("User not found");
            const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new Error("New password must be different");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this.user.updatePassword(userId, hashedPassword);
            return { userId: user._id };
        });
    }
    changePasswordUseCase(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid user ID");
            }
            const user = yield this.user.findById(userId);
            if (!user)
                throw new Error("User not found");
            const matchPass = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!matchPass) {
                throw new Error("Current Passwords do not match");
            }
            const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new Error("New password must be different");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this.user.updatePassword(userId, hashedPassword);
            return { userId: user._id };
        });
    }
    changeEmailUseCase(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email);
            const user = yield this.user.findByEmail(email);
            if (user)
                throw new Error("User already exist");
            const userData = yield this.user.findById(userId);
            if (!userData)
                throw new Error("Current user not found");
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
            userData.otp = otp;
            userData.otpExpiry = otpExpiry;
            yield userData.save();
            yield (0, sendEmailChangeOtp_1.sendEmailChangeOtp)(email, userData.fullName, otp);
            return { userId: userData._id };
        });
    }
    changeEmailOtpUseCase(userId, email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(userId);
            if (!user)
                throw new Error("User not found");
            const userVerify = yield this.user.findByEmail(email);
            if (userVerify)
                throw new Error("User already exist");
            if (Number(user.otp) !== Number(otp) || new Date() > user.otpExpiry) {
                throw new Error("Invalid or expired OTP");
            }
            const userData = yield this.user.updateEmail(userId, email);
            return userData;
        });
    }
    refresh(userId, checkRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(userId);
            if (!user || user.refreshToken !== checkRefreshToken) {
                throw new Error("Invalid refresh token");
            }
            const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(userId, user.email);
            yield this.user.storeRefreshToken(user._id, refreshToken);
            return {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.user.clearRefreshToken(userId);
        });
    }
    getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            const user = yield this.user.findById(userId);
            if (!user) {
                throw new Error("Already Does Not Exists");
            }
            return user;
        });
    }
}
exports.AuthUseCase = AuthUseCase;
//# sourceMappingURL=authUseCase.js.map