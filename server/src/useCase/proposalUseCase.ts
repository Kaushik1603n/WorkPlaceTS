import { ProposalRepo } from "../infrastructure/repositories/implementations/marketPlace/proposalRepo";

export class ProposalUseCase {
  constructor(private proposal: ProposalRepo) {
    this.proposal = proposal;
  }

  async hireRequestUseCase(userId: string, proposalId: string) {
    try {
      if (!userId || !proposalId) {
        throw new Error("Credentials missing");
      }

      const proposal = await this.proposal.findProposalById(proposalId);

    if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (proposal?.clientId?.toString() !== userId.toString()) {
        throw new Error("Not authorized to hire for this job");
      }
console.log( proposal?.status );

      if (
        proposal?.status !== "submitted" &&
        proposal?.status !== "interviewing"
      ) {
        throw new Error("Proposal cannot be hired in its current state");
      }

      const contract = {
        jobId: proposal?.jobId,
        proposalId: proposalId,
        clientId: userId,
        freelancerId: proposal?.freelancerId,
        terms: generateDefaultContractTerms(proposal),
        title: proposal?.jobTitle,
        startDate: new Date(),
        totalAmount: proposal?.bidAmount,
        paymentSchedule:
          proposal?.milestones.length > 0 ? "milestone" : "completion",
      };

      const contractDetails = await this.proposal.createProposalContract(
        contract
      );

      if (!contractDetails) {
        throw new Error("Contract not generated");
      }

      await this.proposal.findProposalAndUpdateStatus(
        proposalId,
        contractDetails._id
      );

      return 
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }
}

const generateDefaultContractTerms = (proposal: any) => {
  const terms = [
    `The freelancer will complete the work as described in proposal ${proposal._id}`,
    `The total contract amount is ${proposal.bidAmount} ${
      proposal?.bidType === "hourly" ? "per hour" : ""
    }`,
    "All work will be completed to professional standards",
    "Any disputes will be resolved through the platform mediation process",
  ];

  if (proposal.milestones.length > 0) {
    terms.push("Payment will be released upon completion of each milestone:");
    proposal.milestones.forEach((milestone: any, index: string) => {
      terms.push(`${index + 1}. ${milestone?.title} - ${milestone?.amount}`);
    });
  }

  return terms.join("\n\n");
};
