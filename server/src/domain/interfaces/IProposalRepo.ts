import mongoose from "mongoose";
import { IProposalMilestonesType } from "../types/proposalMilstoneTypes";

export interface IProposalRepo {
  findProposalAndUpdateStatus(
    proposalId: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any>;
  findProposalById(proposalId: string): Promise<any>;
  getProjectProposalbyId(jobId: string): Promise<any>;
  createProposalContract(
    contract: object,
    session: mongoose.ClientSession
  ): Promise<any>;
  getProposalbyId(userId: string): Promise<any>;
  getContractDetails(
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any>;
  getJobStatus(jobId: string, session: mongoose.ClientSession): Promise<any>;
  acceptProposalContract(
    userId: string,
    jobId: string,
    proposal_id: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any>;
  rejectProposalContract(proposal_id: string, contractId: string): Promise<any>;
  proposalMilestones(jobId: string): Promise<IProposalMilestonesType>;
  proposalMilestonesApprove(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<any>;
  findProposal(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<any>;
  paymentRequest(
    jobId: any,
    freelancerId: any,
    proposalId: string,
    milestoneId: string,
    amount: number,
    clientId: string,
    status: string,
    platformFee: number,
    netAmount: number,
    session: mongoose.ClientSession
  ): Promise<any>;
  updatePaymentID(
    milestoneId: string,
    paymentRequestId: any,
    session: mongoose.ClientSession
  ): Promise<any>;
  proposalMilestonesReject(milestoneId: string): Promise<any>;
  findPayment(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaymentRequestWithPagination>;
}

interface IPaymentRequestWithPagination {
  data: IPaymentRequest[];
  totalPages: number;
  totalCount: number;
}
export interface Proposal {
  _id: string;
  freelancerName: string;
  freelancerEmail: string;
  status: string;
  submittedAt: string;
  bidAmount: string;
}
interface IPaymentRequest {
  jobId: string;
  proposalId: string;
  milestoneId: string;
  amount: number;
  netAmount: number;
  platformFee: number;
  status: "pending" | "paid" | "cancelled";
  freelancerId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}
