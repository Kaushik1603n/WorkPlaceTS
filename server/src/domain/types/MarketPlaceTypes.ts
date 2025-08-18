import { Types } from "mongoose";

export interface JobTypes {
  _id: string;
  job_Id: string;
  title: string;
  stack: string;
  description: string;
  skills: string[];
  budget?: number;
  proposals?: string[];
  createdAt: string;
}
export interface PaginatedJobResponseTypes {
  result: JobTypes[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface JobFilterTypes {
  searchQuery: {
    search?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    jobTypes?: string;
    skills?: string;
    experienceLevel?: string;
  };
  page: number;
  limit: number;
}

export type JobQueryParamsTypes = {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  page: number;
  limit: number;
};

export interface Client {
  fullName?: string;
  email?: string;
}
export interface ProjectDetailsTypes {
  title?: string;
  description?: string;
  stack?: string;
  time?: string;
  reference?: string;
  requiredFeatures?: string;
  budgetType?: string;
  budget?: string | number;
  experienceLevel?: string;
  status?: string;
  clientId?: Client;
}

export interface MarketPlaceClientProjectTypes {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

export interface freelancerProjectType {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

interface Clients {
  _id?: Types.ObjectId;
}

export interface FindProposalByIdResponse {
  proposal_id: Types.ObjectId | undefined;
  status: string | undefined;
  timeline: string | number | undefined;
  bidAmount: number | undefined;
  bidType: string | undefined;
  coverLetter: string | undefined;
  milestones: any[];
  freelancerId: Types.ObjectId | undefined;
  freelancerName: string | undefined;
  freelancerEmail: string | undefined;
  jobId: Types.ObjectId | undefined;
  job_Id: string | undefined;
  jobTitle: string | undefined;
  clientId: Types.ObjectId | Clients | undefined;
  submittedAt: Date | undefined;
}

export interface ContractResponse {
  _id: string;
  jobId: string;
  job_Id: string;
  proposalId: string;
  freelancerId: string;
  clientId: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  totalAmount: number;
  status: "active" | "completed" | "terminated" | "in-progress" | "reject";
  paymentMethod?: string;
  terms: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalListResponse {
  proposal_id: string;
  freelancerName?: string;
  freelancerEmail?: string;
  jobTitle?: string;
  status: string;
  bidAmount: number;
  submittedAt: string;
}

export interface ContractDetailsResponse {
  _id: string;
  job_Id: string;
  proposalId: string;
  freelancerId: string;
  clientId: string;
  jobId: string;
  title: string;
  startDate: Date;
  totalAmount: number;
  status: string;
  terms: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobStatusResponse {
  status: string;
  jobId: string;
}

export interface AcceptProposalContractResponse {
  _id: string;
  jobId: string;
  job_Id: string;
  proposalId: string;
  freelancerId: string;
  clientId: string;
  title: string;
  status: "active" | "completed" | "terminated" | "in-progress" | "reject";
  totalAmount: number;
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: string;
  terms: string[];
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
  deliverables?: DeliverableResponse;
}

export interface ProposalMilestonesApproveResponse {
  proposal_id: string;
  freelancerId: string;
  jobId: string;
  job_Id: string;
  coverLetter: string;
  budgetType: "fixed" | "hourly";
  bidAmount: number;
  estimatedTime?: number;
  workSamples?: string;
  portfolioAttachments: string[];
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

export interface ProposalMilestonesRejectResponse {
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
  milestones: MilestoneResponse[];
  payments: Types.ObjectId[];
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
export interface IProposalMilestoneResult {
  _id: Types.ObjectId | string;
  freelancerId: Types.ObjectId | string;
  jobId: Types.ObjectId | string;
  job_Id?: string;
  milestoneId: Types.ObjectId | string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: string;
  deliverables?: DeliverableResponse;
}

export interface IPaymentRequestResponse {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: "pending" | "paid" | "cancelled";
  freelancerId: Types.ObjectId;
  clientId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
