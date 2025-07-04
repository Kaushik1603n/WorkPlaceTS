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
const mongoose_1 = __importStar(require("mongoose"));
const JobSchema = new mongoose_1.Schema({
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job_Id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredFeatures: { type: String },
    stack: { type: String },
    skills: {
        type: [String],
        default: [],
    },
    budgetType: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true
    },
    budget: { type: Number },
    time: { type: String },
    experienceLevel: {
        type: String,
        enum: ["entry", "intermediate", "expert"],
    },
    status: {
        type: String,
        enum: ["draft", "posted", "in-progress", "completed", "cancelled"],
        default: "posted",
    },
    proposals: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Proposal"
        }],
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    reference: { type: String },
    Attachments: [{ type: String }],
    hiredFreelancer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    hiredProposalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Proposal"
    },
    contractId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Contract"
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "partially-paid", "fully-paid"],
        default: "unpaid",
    },
}, { timestamps: true });
// Create the model
const ProjectModel = mongoose_1.default.model("Job", JobSchema);
exports.default = ProjectModel;
//# sourceMappingURL=Projects.js.map