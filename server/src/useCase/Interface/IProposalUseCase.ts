import { Server } from "socket.io";

export interface IProposalUseCase {
  hireRequestUseCase(
    userId: string,
    proposalId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<any>;
  getAllFreelancerProposalsUseCase(userId: string) : Promise<any>;
  getAllProjectProposalsUseCase(jobId: string): Promise<any>;
  getContractDetailsUseCase(contractId: string): Promise<any>;
  acceptProposalUseCase(
    userId: string,
    contractId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<any>
  rejectProposalUseCase(userId: string, contractId: string): Promise<any>;
  proposalMilestonesUseCase(jobId: string): Promise<any>;
  proposalMilestonesApproveUseCase(
    milestoneId: string,
    userId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<any>;
  proposalMilestonesRejectUseCase(milestoneId: string): Promise<any>;
  pendingPamentsUseCase(userId: string, page: number, limit: number) : Promise<any>;
}
