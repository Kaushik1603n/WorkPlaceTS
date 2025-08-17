import { Types } from "mongoose";

export interface PaymentProposalResponse {
  jobId: string;
  job_Id: string;
  freelancerId: string;
  milestones: {
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
    paymentId?: string;
    paymentRequestId?: string;
    deliverables?: {
      links: string[];
      comments: string;
      submittedAt: Date;
      feedback?: string;
    };
  }[];
}

export interface PaymentRequestResponse {
  _id: string;
  jobId: string;
  proposalId:
    | string
    | {
        _id: string;
        job_Id: string;
        freelancerId: string;
        milestones: {
          _id: string;
          title: string;
          amount: number;
          status:
            | "pending"
            | "submitted"
            | "approved"
            | "rejected"
            | "completed"
            | "paid"
            | "interviewing";
        }[];
      }; // populated Proposal can be either id or minimal object
  freelancerId: string;
  milestoneId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: "pending" | "paid" | "cancelled";
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResponseType {
  _id: string;
  jobId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentGatewayId: string;
  clientId: string;
  freelancerId: Types.ObjectId;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface DeliverableResponse {
  links: string[];
  comments: string;
  submittedAt: Date;
  feedback?: string;
}

export interface MilestoneResponse {
  _id: Types.ObjectId;
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
  paymentId?: string;
  paymentRequestId?: string;
  deliverables?: DeliverableResponse;
}

export interface UpdatePaymentProposalResponse {
  _id: string;
  freelancerId: string;
  jobId: string;
  job_Id: string;
  coverLetter: string;
  budgetType: "fixed" | "hourly";
  bidAmount: number;
  estimatedTime?: number;
  workSamples?: string;
  PortfolioAttachments?: string[];
  milestones: MilestoneResponse[];
  payments: string[];
  status:
    | "submitted"
    | "interviewing"
    | "rejected"
    | "accepted"
    | "cancelled"
    | "active"
    | "completed";
  contractId?: string;
  agreeNDA: boolean;
  agreeVideoCall: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentJobResponse {
  _id: string;
  job_Id: string;
  clientId: string;
  title: string;
  description: string;
}


interface IWalletTransaction {
  type: "credit" | "debit";
  amount: number;
  description: string;
  paymentId?: Types.ObjectId;
  createdAt: Date;
}

export interface IUserWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId | "admin";
  balance: number;
  currency: string;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}