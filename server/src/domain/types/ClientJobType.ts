import { Types } from "mongoose";

export interface ClientProjectType {
  _id: string;
  job_Id: string;
  clientId: Types.ObjectId;
  title: string;
  description: string;
  requiredFeatures?: string;
  stack: string;
  skills: string[];
  budgetType: "fixed" | "hourly";
  budget?: number;
  time?: string;
  experienceLevel?: "entry" | "intermediate" | "expert";
  status?: "draft" | "posted" | "in-progress" | "completed" | "cancelled";
  proposals?: Types.ObjectId[];
  visibility?: "public" | "private";
  reference?: string;
  Attachments?: string[];
  hiredFreelancer?: Types.ObjectId;
  hiredProposalId?: Types.ObjectId;
  contractId?: Types.ObjectId;
  paymentStatus?: "unpaid" | "partially-paid" | "fully-paid";
  createdAt: Date;
  updatedAt: Date;
}
export interface ClientProjectWithPaginationType {
  project:ClientProjectType[],
  totalPage:number
  totalCount:number
}
export interface TicketWithPageinationType {
  result:TicketType[],
  totalPages:number
}
export interface TicketType {
  title: string;
  description: string;
  reportedBy: Types.ObjectId | string;
  client: {
    id: Types.ObjectId | string;
    email: string;
  };
  comments: IComment[];
  status: ReportStatus;
  jobId: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionDetails?: string;
}

export enum ReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REJECTED = "rejected",
}

interface IComment {
  text: string;
  user: string;
  createdAt: Date;
  createdBy: Types.ObjectId | string;
}
