"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClientProfileSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    profilePic: { type: String },
    coverPic: { type: String },
    companyName: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
    totalJobsPosted: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
}, { timestamps: true });
const ClientProfile = mongoose_1.default.model("ClientProfile", ClientProfileSchema);
exports.default = ClientProfile;
//# sourceMappingURL=ClientProfile.js.map