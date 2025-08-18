import mongoose from "mongoose";
import { IProposalMilestonesType } from "../types/proposalMilstoneTypes";
import {
  AcceptProposalContractResponse,
  ContractDetailsResponse,
  ContractResponse,
  FindProposalByIdResponse,
  IPaymentRequestResponse,
  IProposalMilestoneResult,
  JobStatusResponse,
  ProjectDetailsTypes,
  ProposalListResponse,
  ProposalMilestonesApproveResponse,
  ProposalMilestonesRejectResponse,
} from "../types/MarketPlaceTypes";
import { ProposalSummaryResponse } from "../dto/freelancerProposalsDTO";

export interface IProposalRepo {
  findProposalAndUpdateStatus(
    proposalId: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<void>;
  findProposalById(
    proposalId: string
  ): Promise<FindProposalByIdResponse | null>;
  findProjectDetails(jobId: string): Promise<ProjectDetailsTypes>;
  getProjectProposalbyId(jobId: string): Promise<ProposalListResponse[]>;
  createProposalContract(
    contract: object,
    session: mongoose.ClientSession
  ): Promise<ContractResponse>;
  getContractDetailsNormal(
    contractId: string
  ): Promise<ContractDetailsResponse>;
  getProposalbyId(userId: string): Promise<ProposalSummaryResponse[]>;
  getContractDetails(contractId: string): Promise<ContractDetailsResponse>;
  getContractDetailsWithSession(
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<ContractDetailsResponse>;
  getJobStatus(
    jobId: string,
    session: mongoose.ClientSession
  ): Promise<JobStatusResponse>;
  acceptProposalContract(
    userId: string,
    jobId: string,
    proposal_id: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<AcceptProposalContractResponse>;
  rejectProposalContract(
    proposal_id: string,
    contractId: string
  ): Promise<AcceptProposalContractResponse>;
  proposalMilestones(jobId: string): Promise<IProposalMilestonesType>;
  proposalMilestonesApprove(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<ProposalMilestonesApproveResponse | null>;
  findProposal(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<IProposalMilestoneResult | null>;
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
  ): Promise<IPaymentRequestResponse>;
  updatePaymentID(
    milestoneId: string,
    paymentRequestId: any,
    session: mongoose.ClientSession
  ): Promise<void>;
  proposalMilestonesReject(
    milestoneId: string
  ): Promise<ProposalMilestonesRejectResponse | null>;
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
  totalAmount: number;
  netAmount: number;
  platformFee: number;
  pendingAmount: number;
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
