import mongoose, { Document, Schema, Types } from "mongoose";

interface IDeliverable {
  links: string[];
  comments: string;
  submittedAt: Date;
  feedback?: string;
}
interface IMilestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status:
    | "pending"
    | "submitted"
    | "approved"
    | "rejected"
    | "completed"
    | "paid"
    | "interviewing";
  paymentId?: Types.ObjectId; // Reference to Payment document
  paymentRequestId?: Types.ObjectId; // Reference to PaymentRequest document
  deliverables?: IDeliverable;
}

// Define the main Proposal document interface
interface IProposal extends Document {
  _id: string;
  freelancerId: Types.ObjectId;
  jobId: Types.ObjectId;
  job_Id: string;
  coverLetter: string;
  budgetType: "fixed" | "hourly";
  bidAmount: number;
  estimatedTime?: number;
  workSamples?: string;
  PortfolioAttachments?: string[];
  milestones: IMilestone[];
  payments: Types.ObjectId[]; // References to Payment documents
  status:
    | "submitted"
    | "interviewing"
    | "rejected"
    | "accepted"
    | "cancelled"
    | "active"
    | "completed";
  contractId?: Types.ObjectId;
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
        payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
        paymentRequestId: {
          type: Schema.Types.ObjectId,
          ref: "PaymentRequest",
        },
        deliverables: {
          links: [{ type: String }],
          comments: String,
          submittedAt: Date,
        },
      },
    ],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
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
  },
  { timestamps: true }
);

// Create and export the model
const ProposalModel = mongoose.model<IProposal>("Proposal", ProposalSchema);
export default ProposalModel;
