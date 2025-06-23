import { Types } from 'mongoose';

interface IDeliverable {
  links: string[];
  comments: string;
  submittedAt: Date;
}

interface IMilestone {
  _id: Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'paid' | 'interviewing';
  deliverables?: IDeliverable;
}

export interface IProposalMilestones {
  _id: Types.ObjectId;
  jobStatus?:string;
  hiredFreelancer?: Types.ObjectId;
  hiredProposalId?: Types.ObjectId;
  freelancerId: Types.ObjectId;
  milestones: IMilestone[];

}

// If you need a more detailed version with all possible fields:
export interface ICompleteProposal {
  _id: Types.ObjectId;
  freelancerId: Types.ObjectId;
  jobId: Types.ObjectId;
  job_Id: string;
  coverLetter: string;
  budgetType: 'fixed' | 'hourly';
  bidAmount: number;
  estimatedTime?: number;
  workSamples?: string;
  PortfolioAttachments?: string[];
  milestones: IMilestone[];
  status: 'submitted' | 'interviewing' | 'rejected' | 'accepted' | 'cancelled' | 'active' | 'completed';
  contractId?: Types.ObjectId;
  payments?: Types.ObjectId[];
  agreeNDA: boolean;
  agreeVideoCall: boolean;
  createdAt: Date;
  updatedAt: Date;
}