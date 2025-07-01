import mongoose, { ObjectId } from "mongoose";
import { FreelancerProposalResponse } from "../../../../domain/dto/freelancerProposalsDTO";
import { JonContractDetails } from "../../../../domain/dto/proposalContractDTO";
import { ProposalResponse } from "../../../../domain/dto/proposalDTO";
import ContractModel from "../../../../domain/models/ContractModel";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import { IProposalRepo } from "../../../../domain/interfaces/IProposalRepo";
import { IProposalMilestones } from "../../../../domain/dto/proposalMilstoneDTO";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import { IProposalMilestonesType } from "../../../../domain/types/proposalMilstoneTypes";

export class ProposalRepo implements IProposalRepo {
  async findProposalAndUpdateStatus(
    proposalId: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
    try {
      return await ProposalModel.findByIdAndUpdate(
        proposalId,
        {
          $set: { status: "accepted", contractId: contractId },
        },
        { new: true, session }
      ).lean();
    } catch (error) {
      console.error("Error updating proposal status:", error);
      throw new Error("Failed to update proposal status");
    }
  }

  async findProposalById(proposalId: string): Promise<any> {
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

  async createProposalContract(
    contract: object,
    session: mongoose.ClientSession
  ): Promise<any> {
    try {
      return await ContractModel.create([contract], { session });
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }

  async getProposalbyId(userId: string): Promise<any> {
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

  async getProjectProposalbyId(jobId: string): Promise<any> {
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

  async getContractDetailsNormal(contractId: string): Promise<any> {
    try {
      const contractDetails = await ContractModel.findById(
        contractId
      ).lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return contractDetails;
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }

  async getContractDetails(contractId: string): Promise<any> {
    try {
      const contractDetails = await ContractModel.findById(
        contractId
      ).lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return contractDetails;
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }
  async getContractDetailsWithSession(
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
    try {
      const contractDetails = await ContractModel.findById(contractId)
        .session(session)
        .lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return contractDetails;
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }

  async getJobStatus(
    jobId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
    try {
      const status = await ProjectModel.findById(jobId, { status: 1 })
        .session(session)
        .lean<{ status: string; _id?: ObjectId }>();

      if (!status) {
        throw new Error("Job not found");
      }
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
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
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

      return contract;
    } catch (error) {
      console.error("Error update contract accept status:", error);
      throw new Error("Failed to contract accept status");
    }
  }

  async rejectProposalContract(
    proposal_id: string,
    contractId: string
  ): Promise<any> {
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

  async proposalMilestones(jobId: string): Promise<IProposalMilestonesType> {
    const proposal = await ProjectModel.findById(jobId, {
      _id: 1,
      status: 1,
      hiredFreelancer: 1,
      hiredProposalId: 1,
    })
      .populate<{ hiredProposalId: IProposalMilestones }>({
        path: "hiredProposalId",
        select: "_id freelancerId milestones",
      })
      .lean();

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    if (!proposal.hiredProposalId) {
      throw new Error("No hired proposal found");
    }

    return {
      _id: proposal.hiredProposalId._id,
      jobStatus: proposal?.status,
      freelancerId: proposal.hiredProposalId.freelancerId,
      milestones: proposal.hiredProposalId.milestones,
    };
  }

  async proposalMilestonesApprove(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
    return await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "approved" } },
      { new: true, session }
    ).lean();
  }

  async findProposal(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
    const proposal = await ProposalModel.findOne(
      { "milestones._id": milestoneId },
      {
        jobId: 1,
        job_Id: 1,
        freelancerId: 1,
        milestones: { $elemMatch: { _id: milestoneId } },
      }
    )
      .session(session)
      .lean();

    if (!proposal || !proposal.milestones?.length) return null;

    const milestone = proposal.milestones[0];

    return {
      _id: proposal._id,
      freelancerId: proposal.freelancerId,
      jobId: proposal.jobId,
      job_Id: proposal.job_Id,
      milestoneId: milestone._id,
      title: milestone.title,
      description: milestone.description,
      amount: milestone.amount,
      dueDate: milestone.dueDate,
      status: milestone.status,
      deliverables: milestone.deliverables,
    };
  }

  async paymentRequest(
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
  ): Promise<any> {
    return await PaymentRequestModel.create(
      [
        {
          jobId,
          proposalId,
          milestoneId,
          amount,
          platformFee,
          netAmount,
          status,
          freelancerId,
          clientId,
        },
      ],
      { session }
    );
  }

  async updatePaymentID(
    milestoneId: string,
    paymentRequestId: any,
    session: mongoose.ClientSession
  ): Promise<any> {
    await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.paymentRequestId": paymentRequestId } },
      { session }
    );
  }

  async proposalMilestonesReject(milestoneId: string): Promise<any> {
    const proposal = await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "rejected" } },
      { new: true }
    );

    return proposal;
  }

  async findPayment(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaymentRequestWithPagination> {
    const data = await PaymentRequestModel.find({
      clientId: userId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean<IPaymentRequest[]>();

    const totalCount = await PaymentRequestModel.countDocuments({
      clientId: userId,
    });
    const totalPages = Math.ceil(totalCount / limit);

    const objectId = new mongoose.Types.ObjectId(userId);
    const totalAmount = await PaymentRequestModel.aggregate([
      {
        $match: {
          clientId: objectId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const netAmount = await PaymentRequestModel.aggregate([
      {
        $match: {
          clientId: objectId,
        },
      },
      {
        $group: {
          _id: null,
          netAmount: { $sum: "$netAmount" },
        },
      },
    ]);
    const platformFee = await PaymentRequestModel.aggregate([
      {
        $match: {
          clientId: objectId,
         
        },
      },
      {
        $group: {
          _id: null,
          platformFee: { $sum: "$platformFee" },
        },
      },
    ]);
    const pendingAmount = await PaymentRequestModel.aggregate([
      {
        $match: {
          clientId: objectId,
           status:"pending"
        },
      },
      {
        $group: {
          _id: null,
          pendingAmount: { $sum: "$amount" },
        },
      },
    ]);
    

    return {
      data,
      totalPages,
      totalCount,
      totalAmount: totalAmount[0]?.totalAmount || 0,
      netAmount: netAmount[0]?.netAmount || 0,
      platformFee: platformFee[0]?.platformFee || 0,
      pendingAmount: pendingAmount[0]?.pendingAmount || 0,
    };
  }
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
