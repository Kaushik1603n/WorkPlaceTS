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
exports.UserRepo = void 0;
const User_1 = __importDefault(require("../../../domain/models/User"));
class UserRepo {
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.default.findById(_id);
            return result;
        });
    }
    findByIdRefresh(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.default.findById(_id, {
                _id: 1,
                email: 1,
                role: 1,
                fullName: 1,
                isVerification: 1,
                refreshToken: 1,
                createdAt: 1,
            });
            return result;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.default.findOne({ email });
            return result;
        });
    }
    storeRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(userId, { refreshToken });
        });
    }
    clearRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(userId, { refreshToken: null });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.create(userData);
        });
    }
    updatePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(userId, {
                password: hashedPassword,
                otp: undefined,
                otpExpiry: undefined,
            });
        });
    }
    updateRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findByIdAndUpdate(userId, { role }, { new: true });
        });
    }
    updateEmail(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.default.findByIdAndUpdate(userId, { email }, { new: true });
            return result;
        });
    }
    updateName(userId, fullName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId, {
                isVerification: 1,
                fullName: 1,
                email: 1,
            });
            const status = (user === null || user === void 0 ? void 0 : user.isVerification) === "verified" ? "verified" : "pending";
            const result = yield User_1.default.findByIdAndUpdate(userId, { fullName, isVerification: status }, { new: true });
            return result;
        });
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=userRepo.js.map