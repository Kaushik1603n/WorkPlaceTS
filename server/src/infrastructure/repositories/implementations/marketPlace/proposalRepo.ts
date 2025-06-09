import { FreelancerProposalResponse } from "../../../../domain/dto/freelancerProposalsDTO";
import { JonContractDetails } from "../../../../domain/dto/proposalContractDTO";
import { ProposalResponse } from "../../../../domain/dto/proposalDTO";
import ContractModel from "../../../../domain/models/ContractModel";
import ProposalModel from "../../../../domain/models/Proposal";

export class ProposalRepo {
  async findProposalAndUpdateStatus(proposalId: string, contractId: string) {
    try {
      return await ProposalModel.findByIdAndUpdate(
        proposalId,
        {
          $set: { status: "accepted", contractId: contractId },
        },
        { new: true }
      ).lean();
    } catch (error) {
      console.error("Error updating proposal status:", error);
      throw new Error("Failed to update proposal status");
    }
  }
  async findProposalById(proposalId: string) {
    try {
      const getProposal = await ProposalModel.findById(proposalId)
        .select(
          "status estimatedTime bidAmount budgetType coverLetter milestones freelancerId jobId createdAt"
        )
        .populate({
          path: "freelancerId",
          select: "-password -refreshToken",
        })
        .populate({
          path: "jobId",
        })
        .lean<ProposalResponse | null>();
      return {
        proposal_id: getProposal?._id,
        status: getProposal?.status,
        timeline: getProposal?.estimatedTime,
        bidAmount: getProposal?.bidAmount,
        bidType: getProposal?.budgetType,
        coverLetter: getProposal?.coverLetter,
        milestones: getProposal?.milestones || [],
        freelancerId: getProposal?.freelancerId?._id,
        freelancerName: getProposal?.freelancerId?.fullName,
        freelancerEmail: getProposal?.freelancerId?.email,
        jobId: getProposal?.jobId?._id,
        jobTitle: getProposal?.jobId?.title,
        clientId: getProposal?.jobId?.clientId,
        submittedAt: getProposal?.createdAt,
      };
    } catch (error) {
      console.error("Error finding proposal by ID:", error);
      throw new Error("Failed to find proposal");
    }
  }

  async createProposalContract(contract: object) {
    try {
      return await ContractModel.create(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }
  async getProposalbyId(userId: string) {
    try {
      const proposals = await ProposalModel.find({ freelancerId: userId })
        .populate({
          path: "jobId",
          select: "title budgetType budget status",
        })
        .sort({ createdAt: -1 })
        .lean<FreelancerProposalResponse[] | null>();

      return proposals;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }
  async getContractDetails(contractId: string) {
    try {
      const contractDetails = await ContractModel.findById(
        contractId
      ).lean<JonContractDetails>();

      return contractDetails;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }
}
