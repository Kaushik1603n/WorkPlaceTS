import { ObjectId } from "mongodb";

interface Milestone {
  _id: ObjectId;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: string;
}

interface JobSummary {
  _id: ObjectId;
  budget: number;
  budgetType: string;
  status: string;
  title: string;
}

export interface FreelancerProposalResponse {
  _id: ObjectId;
  freelancerId: ObjectId;
  jobId: JobSummary;
  coverLetter: string;
  budgetType: string;
  bidAmount: number;
  estimatedTime: number;
  workSamples: string;
  agreeVideoCall: boolean;
  agreeNDA: boolean;
  PortfolioAttachments: any[]; // Use a specific type if available
  milestones: Milestone[];
  status: string;
  payments: any[]; // Use a specific type if available
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  contractId: ObjectId;
}
