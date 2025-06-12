export interface IProposalRepo {
  findProposalAndUpdateStatus(
    proposalId: string,
    contractId: string
  ): Promise<any>;
  findProposalById(proposalId: string): Promise<any>;
  getProjectProposalbyId(jobId: string): Promise<any>;
  createProposalContract(contract: object): Promise<any>;
  getProposalbyId(userId: string): Promise<any>;
  getContractDetails(contractId: string): Promise<any>;
  getJobStatus(jobId: string): Promise<any>;
  acceptProposalContract(
    userId: string,
    jobId: string,
    proposal_id: string,
    contractId: string
  ): Promise<any>;
  rejectProposalContract(proposal_id: string, contractId: string): Promise<any>;
}


export interface Proposal {
    _id: string;
    freelancerName: string;
    freelancerEmail: string;
    status: string;
    submittedAt: string;
    bidAmount: string;
}

