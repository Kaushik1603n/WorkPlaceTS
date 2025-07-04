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
exports.ClientProfileUserCase = void 0;
const cloudinary_1 = __importDefault(require("../infrastructure/cloudinary"));
class ClientProfileUserCase {
    constructor(client, user) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        this.client = client;
        this.user = user;
    }
    clientProfileEdit(userId, companyName, description, location, website, coverPic, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            // console.log(coverPic);
            let coverPromise, profilePromise;
            if (coverPic && !coverPic.includes("res.cloudinary.com")) {
                coverPromise = cloudinary_1.default.uploader.upload(coverPic, {
                    folder: "cover_uploads",
                });
                console.log((yield coverPromise).url);
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
            const clientProfileData = yield this.client.findOneAndUpdate(userId, companyName, description, location, website, coverResult, profileResult);
            if (!clientProfileData) {
                throw new Error("Failed to update client profile");
            }
            return clientProfileData;
        });
    }
    updateNameAndEmail(userId, fullName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            if (!email || !fullName) {
                throw new Error("Email and full name are required");
            }
            const user = yield this.user.findByEmail(email);
            // if (!user) throw new Error("Invalid credentials");
            if (user.email !== email) {
                const emailUsed = yield this.user.findByEmail(email);
                if (!emailUsed) {
                    return this.user.updateEmail(userId, email);
                }
                else {
                    throw new Error("Email already in use");
                }
            }
            const userData = yield this.user.updateName(userId, fullName);
            return userData;
        });
    }
    profileDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== "string") {
                throw new Error("Invalid user ID");
            }
            const result = yield this.client.findOne(userId);
            return result;
        });
    }
    freelancerUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.findFreelancer(page, limit);
            return result;
        });
    }
    HiringProjectsUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.findProjectByUserId(userId);
            return result;
        });
    }
    FinancialDataUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.findFinancialByUserId(userId);
            return result;
        });
    }
}
exports.ClientProfileUserCase = ClientProfileUserCase;
//# sourceMappingURL=clientProfileUseCase.js.map