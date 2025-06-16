import mongoose, { ObjectId } from "mongoose";
import { FreelancerProposalResponse } from "../../../../domain/dto/freelancerProposalsDTO";
import { JonContractDetails } from "../../../../domain/dto/proposalContractDTO";
import { ProposalResponse } from "../../../../domain/dto/proposalDTO";
import ContractModel from "../../../../domain/models/ContractModel";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import { IProposalRepo } from "../../../../domain/interfaces/IProposalRepo";
import { IProposalMilestones } from "../../../../domain/dto/proposalMilstoneDTO";

export class ProposalRepo implements IProposalRepo {
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
        job_Id: getProposal?.jobId?.job_Id,
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

  async getProjectProposalbyId(jobId: string) {
    try {
      const allProposals = await ProposalModel.find(
        { jobId: jobId },
        {
          _id: 1,
          freelancerId: 1,
          status: 1,
          createdAt: 1,
          bidAmount: 1,
          jobId: 1, // Make sure to include jobId in the projection
        }
      )
        .populate<{ freelancerId: PopulatedFreelancer }>({
          path: "freelancerId",
          select: "fullName email",
        })
        .populate<{ jobId: PopulatedJob }>({
          path: "jobId",
          select: "title stack",
        })
        .sort({ createdAt: -1 })
        .lean<Proposal[]>();

      const formattedProposals = allProposals.map((proposal) => ({
        proposal_id: proposal._id.toString(),
        freelancerName: (proposal.freelancerId as PopulatedFreelancer)
          ?.fullName,
        freelancerEmail: (proposal.freelancerId as PopulatedFreelancer)?.email,
        jobTitle: (proposal.jobId as PopulatedJob)?.title,
        status: proposal.status,
        bidAmount: proposal.bidAmount,
        submittedAt: new Date(proposal.createdAt).toLocaleString(),
      }));

      return formattedProposals;
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

  async getJobStatus(jobId: string) {
    try {
      const status = await ProjectModel.findById(jobId, { status: 1 }).lean<{
        status: string;
        _id?: ObjectId;
      }>();

      return status;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }

  async acceptProposalContract(
    userId: string,
    jobId: string,
    proposal_id: string,
    contractId: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const job = await ProjectModel.findByIdAndUpdate(
        jobId,
        {
          hiredProposalId: proposal_id,
          status: "in-progress",
          hiredFreelancer: userId,
          contractId: contractId,
        },
        { new: true, session }
      );

      if (!job) {
        throw new Error("Job not found");
      }
      const contract = await ContractModel.findByIdAndUpdate(
        contractId,
        {
          status: "in-progress",
        },
        { new: true, session }
      );

      if (!contract) {
        throw new Error("Contract not found");
      }

      const proposal = await ProposalModel.findByIdAndUpdate(
        proposal_id,
        {
          status: "interviewing",
        },
        { new: true, session }
      );

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      await session.commitTransaction();

      return contract;
    } catch (error) {
      await session.abortTransaction();
      console.error("Error update contract accept status:", error);
      throw new Error("Failed to contract accept status");
    } finally {
      session.endSession();
    }
  }

  async rejectProposalContract(proposal_id: string, contractId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const contract = await ContractModel.findByIdAndUpdate(
        contractId,
        {
          status: "reject",
        },
        { new: true, session }
      );

      if (!contract) {
        throw new Error("Contract not found");
      }

      const proposal = await ProposalModel.findByIdAndUpdate(
        proposal_id,
        {
          status: "rejected",
        },
        { new: true, session }
      );

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      await session.commitTransaction();

      return contract;
    } catch (error) {
      await session.abortTransaction();
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    } finally {
      session.endSession();
    }
  }
  async proposalMilestones(jobId: string): Promise<IProposalMilestones> {
    const proposal = await ProposalModel.findOne(
      { jobId },
      { _id: 1, freelancerId: 1, milestones: 1 }
    ).lean<IProposalMilestones>();

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    return {
      _id: proposal._id,
      freelancerId: proposal.freelancerId,
      milestones: proposal.milestones,
    };
  }
  async proposalMilestonesApprove(milestoneId: string) {
    const proposal = await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "approved" } },
      { new: true }
    );

    return proposal;
  }
  async proposalMilestonesReject(milestoneId: string) {
    const proposal = await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "rejected" } },
      { new: true }
    );

    return proposal;
  }
}

interface PopulatedFreelancer {
  _id: string;
  fullName: string;
  email: string;
}

interface PopulatedJob {
  _id: string;
  title: string;
  stack: string[];
}

interface Proposal {
  _id: string;
  freelancerId: PopulatedFreelancer | ObjectId; // Can be either populated or just ObjectId
  jobId: PopulatedJob | ObjectId;
  status: string;
  createdAt: Date;
  bidAmount: number;
}
