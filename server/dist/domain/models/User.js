"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verification = exports.SocialProvider = exports.UserStatus = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enums
var UserRole;
(function (UserRole) {
    UserRole["FREELANCER"] = "freelancer";
    UserRole["CLIENT"] = "client";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BLOCK"] = "block";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var SocialProvider;
(function (SocialProvider) {
    SocialProvider["GOOGLE"] = "google";
    SocialProvider["FACEBOOK"] = "facebook";
    SocialProvider["GITHUB"] = "github";
})(SocialProvider || (exports.SocialProvider = SocialProvider = {}));
var verification;
(function (verification) {
    verification["FALSE"] = "false";
    verification["PENDING"] = "pending";
    verification["VERIFIED"] = "verified";
    verification["REJECTED"] = "rejected";
})(verification || (exports.verification = verification = {}));
// Schema
const UserSchema = new mongoose_1.Schema({
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(UserRole),
    },
    isVerified: { type: Boolean, default: false },
    isVerification: {
        type: String,
        enum: Object.values(verification),
        default: verification.FALSE,
    },
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    feedbackCount: { type: Number, default: 0 },
    freelancerRatings: {
        avgQuality: { type: Number, default: 0, min: 0, max: 5 },
        avgDeadlines: { type: Number, default: 0, min: 0, max: 5 },
        avgProfessionalism: { type: Number, default: 0, min: 0, max: 5 },
    },
    clientRatings: {
        avgClarity: { type: Number, default: 0, min: 0, max: 5 },
        avgPayment: { type: Number, default: 0, min: 0, max: 5 },
        avgCommunication: { type: Number, default: 0, min: 0, max: 5 },
    },
    otp: { type: Number },
    otpExpiry: { type: Date },
    refreshToken: { type: String, default: null },
    googleId: { type: String, unique: true, sparse: true },
    pic: { type: String },
    socialLogins: [
        {
            provider: { type: String, enum: Object.values(SocialProvider) },
            providerId: { type: String },
        },
    ],
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
    },
    lastLogin: { type: Date },
}, { timestamps: true });
// Virtuals
UserSchema.virtual("jobs", {
    ref: "Job",
    localField: "_id",
    foreignField: "clientId",
});
UserSchema.virtual("profile", {
    ref: "FreelancerProfile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });
// Export model
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map