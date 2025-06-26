import mongoose from "mongoose";
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

      if (
        proposal?.status !== "submitted" &&
        proposal?.status !== "interviewing"
      ) {
        throw new Error("Proposal cannot be hired in its current state");
      }

      const contract = {
        jobId: proposal?.jobId,
        job_Id: proposal?.job_Id  || new Date(),
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

      return;
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }

  async getAllFreelancerProposalsUseCase(userId: string) {
    try {
      const getAllProposals = await this.proposal.getProposalbyId(userId);

      // if (!getAllProposals || getAllProposals?.length) {
      //   return { message: "No proposals found" }
      // }
      return getAllProposals;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async getAllProjectProposalsUseCase(jobId: string) {
    try {
      const getAllProposals = await this.proposal.getProjectProposalbyId(jobId);

      return getAllProposals;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async getContractDetailsUseCase(contractId: string) {
    try {
      const contractDetails = await this.proposal.getContractDetails(
        contractId
      );

      return contractDetails;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async acceptProposalUseCase(userId: string, contractId: string) {
    try {
      const contractDetails = await this.proposal.getContractDetails(
        contractId
      );

      const proposal_id = contractDetails?.proposalId
        ? contractDetails?.proposalId
        : "";

      if (
        contractDetails?.freelancerId.toString() !== userId.toString() &&
        contractDetails?.status === "reject"
      ) {
        throw new Error("You cannot accept this proposal");
      }

      const jobId = contractDetails?.jobId ? contractDetails.jobId : "";

      const jobStatus = await this.proposal.getJobStatus(jobId as string);

      if (jobStatus?.status !== "posted" && jobStatus?.status !== "draft") {
        throw new Error("Cannot Accept this Contract");
      }

      const contract = await this.proposal.acceptProposalContract(
        userId,
        jobId as string,
        proposal_id as string,
        contractId
      );

      return contract;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async rejectProposalUseCase(userId: string, contractId: string) {
    try {
      const contractDetails = await this.proposal.getContractDetails(
        contractId
      );

      const proposal_id = contractDetails?.proposalId
        ? contractDetails?.proposalId
        : "";

      if (contractDetails?.freelancerId.toString() !== userId.toString()) {
        throw new Error("You cannot reject this proposal");
      }

      const contract = await this.proposal.rejectProposalContract(
        proposal_id as string,
        contractId
      );

      return contract;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }
  async proposalMilestonesUseCase(jobId: string) {
    try {
      const data = await this.proposal.proposalMilestones(jobId);

      return data;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

async proposalMilestonesApproveUseCase(milestoneId: string, userId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const proposalApprove = await this.proposal.proposalMilestonesApprove(
      milestoneId,
      session
    );
    if (!proposalApprove) throw new Error("Milestone not found");

    const proposal = await this.proposal.findProposal(milestoneId, session);
    if (!proposal) throw new Error("Proposal not found");

    const platformFee=(proposal.amount/100)*10;
    const netAmount=proposal.amount-platformFee
    const paymentRequest = await this.proposal.paymentRequest(
      proposal.jobId,
      proposal.freelancerId,
      proposal._id,
      milestoneId,
      proposal.amount,
      userId,
      "pending",
      platformFee,
      netAmount,
      session
    );
    await this.proposal.updatePaymentID(
      milestoneId,
      paymentRequest[0]._id,     
      session
    );

    
    await session.commitTransaction();
    session.endSession();

    return proposalApprove;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Proposal usecase error`, error);
    throw error;
  }
}


  async proposalMilestonesRejectUseCase(milestoneId: string) {
    try {
      const proposal = await this.proposal.proposalMilestonesReject(
        milestoneId
      );

      if (!proposal) {
        throw new Error("Milestone not found");
      }

      return proposal;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async pendingPamentsUseCase (userId:string,page:number,limit:number){

    const data = await this.proposal.findPayment(userId,page,limit)
    return data
  }
}

const generateDefaultContractTerms = (proposal: any) => {
  const terms = [
    `The freelancer will complete the work as described in proposal ${proposal?.proposal_id}`,
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
