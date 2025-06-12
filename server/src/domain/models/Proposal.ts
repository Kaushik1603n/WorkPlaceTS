import mongoose, { Document, Schema, Types } from "mongoose";

// Define types for the Milestone subdocument
interface IMilestone {
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "approved" | "completed" | "paid";
  paymentId?: string;
}

// Define the main Proposal document interface
interface IProposal extends Document {
  _id:string;
  freelancerId: Types.ObjectId;
  jobId: Types.ObjectId;
  coverLetter: string;
  budgetType: "fixed" | "hourly";
  bidAmount: number;
  estimatedTime?: number;
  workSamples?: string;
  PortfolioAttachments?: string[];
  milestones: IMilestone[];
  status:
    | "submitted"
    | "interviewing"
    | "rejected"
    | "accepted"
    | "cancelled"
    | "active"
    | "completed";
  contractId?: Types.ObjectId;
  payments?: Types.ObjectId[];
  agreeNDA: boolean;
  agreeVideoCall: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema = new Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
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
          enum: ["pending", "approved", "completed", "paid"],
          default: "pending",
        },
        paymentId: String,
      },
    ],
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
      type: Schema.Types.ObjectId,
      ref: "Contract",
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  { timestamps: true }
);

// Create and export the model
const ProposalModel = mongoose.model<IProposal>("Proposal", ProposalSchema);
export default ProposalModel;
