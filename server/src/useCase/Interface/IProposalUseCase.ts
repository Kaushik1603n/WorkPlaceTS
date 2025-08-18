import { Server } from "socket.io";
import { ProposalSummaryResponse } from "../../domain/dto/freelancerProposalsDTO";
import { AcceptProposalContractResponse, ContractDetailsResponse, ProposalListResponse, ProposalMilestonesApproveResponse, ProposalMilestonesRejectResponse } from "../../domain/types/MarketPlaceTypes";
import { IProposalMilestonesType } from "../../domain/types/proposalMilstoneTypes";
import { IPaymentRequestWithPagination } from "../../infrastructure/repositories/implementations/marketPlace/proposalRepo";

export interface IProposalUseCase {
  hireRequestUseCase(
    userId: string,
    proposalId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ):Promise<void>;
  getAllFreelancerProposalsUseCase(userId: string): Promise<ProposalSummaryResponse[]>;
  getAllProjectProposalsUseCase(jobId: string): Promise<ProposalListResponse[]>;
  getContractDetailsUseCase(contractId: string): Promise<ContractDetailsResponse>;
  acceptProposalUseCase(
    userId: string,
    contractId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<AcceptProposalContractResponse>;
  rejectProposalUseCase(userId: string, contractId: string): Promise<AcceptProposalContractResponse>;
  proposalMilestonesUseCase(jobId: string): Promise<IProposalMilestonesType>;
  proposalMilestonesApproveUseCase(
    milestoneId: string,
    userId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<ProposalMilestonesApproveResponse | null>;
  proposalMilestonesRejectUseCase(milestoneId: string): Promise<ProposalMilestonesRejectResponse | null>;
  pendingPamentsUseCase(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaymentRequestWithPagination>;
}
