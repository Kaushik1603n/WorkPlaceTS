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
exports.FreelancerProfileUseCase = void 0;
const cloudinary_1 = __importDefault(require("../infrastructure/cloudinary"));
class FreelancerProfileUseCase {
    constructor(freelancer, user) {
        Object.defineProperty(this, "freelancer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: freelancer
        });
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        this.freelancer = freelancer;
        this.user = user;
    }
    freelancerProfileEdit(userId, availability, experience, education, hourlyRate, skills, location, reference, bio, coverPic, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            let coverPromise, profilePromise;
            if (coverPic && !coverPic.includes("res.cloudinary.com")) {
                coverPromise = cloudinary_1.default.uploader.upload(coverPic, {
                    folder: "cover_uploads",
                });
            }
            else {
                coverPromise = Promise.resolve({ secure_url: coverPic });
            }
            if (profilePic && !profilePic.includes("res.cloudinary.com")) {
                profilePromise = cloudinary_1.default.uploader.upload(profilePic, {
                    folder: "profile_uploads",
                });
            }
            else {
                profilePromise = Promise.resolve({ secure_url: profilePic });
            }
            const [coverResult, profileResult] = yield Promise.all([
                coverPromise,
                profilePromise,
            ]);
            const freelancerProfileData = yield this.freelancer.findOneAndUpdate(userId, availability, experience, education, hourlyRate, skills, location, reference, bio, coverResult, profileResult);
            if (!freelancerProfileData) {
                throw new Error("Failed to update freelancer profile");
            }
            return freelancerProfileData;
        });
    }
    updateNameAndEmail(userId, fullName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !fullName) {
                throw new Error("Email and full name are required");
            }
            const user = yield this.user.findById(userId);
            if ((user === null || user === void 0 ? void 0 : user.email) !== email) {
                const emailUsed = yield this.user.findByEmail(email);
                if (!emailUsed) {
                    return this.user.updateEmail(userId, email);
                }
                else {
                    throw new Error("Email already in use");
                }
            }
            const userData = yield this.user.updateName(userId, fullName);
            return userData !== null && userData !== void 0 ? userData : user;
        });
    }
    profileDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            const result = yield this.freelancer.findOne(userId);
            return result;
        });
    }
    clientUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.freelancer.findFreelancer(page, limit);
            return result;
        });
    }
    freelancerTicketUseCase(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.freelancer.findFreelancerTicket(userId, page, limit);
            return result;
        });
    }
    totalcountUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.freelancer.findCounts(userId);
            return result;
        });
    }
    totalEarningsUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.freelancer.findTotalEarnings(userId);
            return result;
        });
    }
    dashboardProjectUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.freelancer.findTotalProject(userId);
            return result;
        });
    }
}
exports.FreelancerProfileUseCase = FreelancerProfileUseCase;
//# sourceMappingURL=freelancerProfileUseCase.js.map