"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FreelancerProfileSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    headline: { type: String },
    bio: { type: String },
    profilePic: { type: String },
    coverPic: { type: String },
    skills: {
        type: [String], // Array of strings
        default: [],
    },
    hourlyRate: { type: Number },
    location: { type: String },
    availability: {
        type: String,
        enum: ["full-time", "part-time", "not-available"],
    },
    experienceLevel: {
        type: String,
    },
    education: { type: String },
    languages: { type: String },
    reference: { type: String },
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
}, { timestamps: true });
const FreelancerProfile = mongoose_1.default.model("FreelancerProfile", FreelancerProfileSchema);
exports.default = FreelancerProfile;
//# sourceMappingURL=FreelancerProfile.js.map