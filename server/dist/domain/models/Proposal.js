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
const ProposalSchema = new mongoose_1.Schema({
    freelancerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
    },
    job_Id: {
        type: String,
    },
    budgetType: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true,
    },
    bidAmount: {
        type: Number,
        required: true,
    },
    estimatedTime: {
        type: Number,
    },
    workSamples: {
        type: String,
    },
    agreeVideoCall: { type: Boolean },
    agreeNDA: { type: Boolean },
    PortfolioAttachments: [
        {
            type: String,
        },
    ],
    milestones: [
        {
            title: String,
            description: String,
            amount: Number,
            dueDate: Date,
            status: {
                type: String,
                enum: [
                    "pending",
                    "submitted",
                    "approved",
                    "rejected",
                    "completed",
                    "paid",
                    "interviewing",
                ],
                default: "pending",
            },
            payments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" }],
            paymentRequestId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "PaymentRequest",
            },
            deliverables: {
                links: [{ type: String }],
                comments: String,
                submittedAt: Date,
            },
        },
    ],
    payments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" }],
    status: {
        type: String,
        enum: [
            "submitted",
            "interviewing",
            "rejected",
            "accepted",
            "cancelled",
            "active",
            "completed",
        ],
        default: "submitted",
    },
    contractId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Contract",
    },
}, { timestamps: true });
// Create and export the model
const ProposalModel = mongoose_1.default.model("Proposal", ProposalSchema);
exports.default = ProposalModel;
//# sourceMappingURL=Proposal.js.map