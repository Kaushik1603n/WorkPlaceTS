import mongoose, { ObjectId } from "mongoose";
import {
  FreelancerProposalResponse,
  ProposalSummaryResponse,
} from "../../../../domain/dto/freelancerProposalsDTO";
import { JonContractDetails } from "../../../../domain/dto/proposalContractDTO";
import { ProposalResponse } from "../../../../domain/dto/proposalDTO";
import ContractModel from "../../../../domain/models/ContractModel";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import { IProposalRepo } from "../../../../domain/interfaces/IProposalRepo";
import { IProposalMilestones } from "../../../../domain/dto/proposalMilstoneDTO";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import { IProposalMilestonesType } from "../../../../domain/types/proposalMilstoneTypes";
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
} from "../../../../domain/types/MarketPlaceTypes";
import { isValidObjectId } from "mongoose";
import UserModel from "../../../../domain/models/User";

export class ProposalRepo implements IProposalRepo {
  async findProposalAndUpdateStatus(
    proposalId: string,
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<void> {
    try {
      await ProposalModel.findByIdAndUpdate(
        proposalId,
        {
          $set: { status: "accepted", contractId: contractId },
        },
        { new: true, session }
      ).lean();
      return;
    } catch (error) {
      console.error("Error updating proposal status:", error);
      throw new Error("Failed to update proposal status");
    }
  }

  async findProposalById(
    proposalId: string
  ): Promise<FindProposalByIdResponse | null> {
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

  async findProjectDetails(jobId: string): Promise<ProjectDetailsTypes> {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(jobId);
      const client = await UserModel.findById(project?.clientId);

      const result: ProjectDetailsTypes = {
        title: project?.title,
        status: project?.status,
        description: project?.description,
        stack: project?.stack,
        time: project?.time,
        reference: project?.reference,
        requiredFeatures: project?.requiredFeatures,
        budgetType: project?.budgetType,
        budget: project?.budget,
        experienceLevel: project?.experienceLevel,
        clientId: {
          fullName: client?.fullName,
          email: client?.email,
        },
      };
      return result;
    } catch (error) {
      console.error(`[findProjectDetails] DB error for job ${jobId}:`, error);
      throw error;
    }
  }

  async createProposalContract(
    contract: object,
    session: mongoose.ClientSession
  ): Promise<ContractResponse> {
    try {
      const [newContract] = await ContractModel.create([contract], { session });

      return {
        _id: newContract._id.toString(),
        jobId: newContract.jobId.toString(),
        job_Id: newContract.job_Id,
        proposalId: newContract.proposalId.toString(),
        freelancerId: newContract.freelancerId.toString(),
        clientId: newContract.clientId.toString(),
        title: newContract.title,
        description: newContract.description,
        startDate: newContract.startDate,
        endDate: newContract.endDate,
        totalAmount: newContract.totalAmount,
        status: newContract.status,
        paymentMethod: newContract.paymentMethod,
        terms: newContract.terms,
        createdAt: newContract.createdAt,
        updatedAt: newContract.updatedAt,
      };
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }

  async getProposalbyId(userId: string): Promise<ProposalSummaryResponse[]> {
    try {
      const proposals = await ProposalModel.find({ freelancerId: userId })
        .populate({
          path: "jobId",
          select: "title budgetType budget status",
        })
        .sort({ createdAt: -1 })
        .lean<FreelancerProposalResponse[] | null>();

      if (!proposals) return [];

      return proposals.map((proposal) => ({
        proposalId: proposal._id.toString(),
        freelancerId: proposal.freelancerId.toString(),
        jobId: proposal.jobId,
        job_Id: proposal.jobId._id.toString(),
        jobTitle: proposal.jobId.title,
        jobBudget: proposal.jobId.budget,
        jobBudgetType: proposal.jobId.budgetType,
        jobStatus: proposal.jobId.status,
        coverLetter: proposal.coverLetter,
        bidAmount: proposal.bidAmount,
        estimatedTime: proposal.estimatedTime,
        status: proposal.status,
        milestones: proposal.milestones.map((m) => ({
          milestoneId: m._id.toString(),
          title: m.title,
          description: m.description,
          amount: m.amount,
          dueDate: m.dueDate,
          status: m.status,
        })),
        submittedAt: proposal.createdAt,
      }));
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }

  async getProjectProposalbyId(jobId: string): Promise<ProposalListResponse[]> {
    try {
      const allProposals = await ProposalModel.find(
        { jobId: jobId },
        {
          _id: 1,
          freelancerId: 1,
          status: 1,
          createdAt: 1,
          bidAmount: 1,
          jobId: 1,
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

  async getContractDetailsNormal(
    contractId: string
  ): Promise<ContractDetailsResponse> {
    try {
      const contractDetails = await ContractModel.findById(
        contractId
      ).lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return {
        _id: contractDetails._id.toString(),
        job_Id: contractDetails.job_Id,
        proposalId: contractDetails.proposalId.toString(),
        freelancerId: contractDetails.freelancerId.toString(),
        clientId: contractDetails.clientId.toString(),
        jobId: contractDetails.jobId.toString(),
        title: contractDetails.title,
        startDate: contractDetails.startDate,
        totalAmount: contractDetails.totalAmount,
        status: contractDetails.status,
        terms: contractDetails.terms,
        createdAt: contractDetails.createdAt,
        updatedAt: contractDetails.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }

  async getContractDetails(
    contractId: string
  ): Promise<ContractDetailsResponse> {
    try {
      const contractDetails = await ContractModel.findById(
        contractId
      ).lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return {
        _id: contractDetails._id.toString(),
        job_Id: contractDetails.job_Id,
        proposalId: contractDetails.proposalId.toString(),
        freelancerId: contractDetails.freelancerId.toString(),
        clientId: contractDetails.clientId.toString(),
        jobId: contractDetails.jobId.toString(),
        title: contractDetails.title,
        startDate: contractDetails.startDate,
        totalAmount: contractDetails.totalAmount,
        status: contractDetails.status,
        terms: contractDetails.terms,
        createdAt: contractDetails.createdAt,
        updatedAt: contractDetails.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }

  async getContractDetailsWithSession(
    contractId: string,
    session: mongoose.ClientSession
  ): Promise<ContractDetailsResponse> {
    try {
      const contractDetails = await ContractModel.findById(contractId)
        .session(session)
        .lean<JonContractDetails>();

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      return {
        _id: contractDetails._id.toString(),
        job_Id: contractDetails.job_Id,
        proposalId: contractDetails.proposalId.toString(),
        freelancerId: contractDetails.freelancerId.toString(),
        clientId: contractDetails.clientId.toString(),
        jobId: contractDetails.jobId.toString(),
        title: contractDetails.title,
        startDate: contractDetails.startDate,
        totalAmount: contractDetails.totalAmount,
        status: contractDetails.status,
        terms: contractDetails.terms,
        createdAt: contractDetails.createdAt,
        updatedAt: contractDetails.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw new Error("Failed to fetch contract details");
    }
  }

  async getJobStatus(
    jobId: string,
    session: mongoose.ClientSession
  ): Promise<JobStatusResponse> {
    try {
      const status = await ProjectModel.findById(jobId, { status: 1 })
        .session(session)
        .lean<{ status: string; _id?: ObjectId }>();

      if (!status) {
        throw new Error("Job not found");
      }

      return {
        status: status.status,
        jobId: status._id?.toString() ?? jobId,
      };
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
  ): Promise<AcceptProposalContractResponse> {
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

      return {
        _id: contract._id.toString(),
        jobId: contract.jobId.toString(),
        job_Id: proposal.job_Id,
        proposalId: contract.proposalId.toString(),
        freelancerId: contract.freelancerId.toString(),
        clientId: contract.clientId.toString(),
        title: contract.title,
        status: contract.status,
        totalAmount: contract.totalAmount,
        startDate: contract.startDate,
        endDate: contract.endDate,
        paymentMethod: contract.paymentMethod,
        terms: contract.terms,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      };
    } catch (error) {
      console.error("Error update contract accept status:", error);
      throw new Error("Failed to contract accept status");
    }
  }

  async rejectProposalContract(
    proposal_id: string,
    contractId: string
  ): Promise<AcceptProposalContractResponse> {
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

      return {
        _id: contract._id.toString(),
        jobId: contract.jobId.toString(),
        job_Id: proposal.job_Id,
        proposalId: contract.proposalId.toString(),
        freelancerId: contract.freelancerId.toString(),
        clientId: contract.clientId.toString(),
        title: contract.title,
        status: contract.status,
        totalAmount: contract.totalAmount,
        startDate: contract.startDate,
        endDate: contract.endDate,
        paymentMethod: contract.paymentMethod,
        terms: contract.terms,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      };
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
  ): Promise<ProposalMilestonesApproveResponse | null> {
    const updatedProposal = await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "approved" } },
      { new: true, session }
    ).lean();

    if (!updatedProposal) return null;

    return {
      proposal_id: updatedProposal._id.toString(),
      freelancerId: updatedProposal.freelancerId.toString(),
      jobId: updatedProposal.jobId.toString(),
      job_Id: updatedProposal.job_Id,
      coverLetter: updatedProposal.coverLetter,
      budgetType: updatedProposal.budgetType,
      bidAmount: updatedProposal.bidAmount,
      estimatedTime: updatedProposal.estimatedTime,
      workSamples: updatedProposal.workSamples,
      portfolioAttachments: updatedProposal.PortfolioAttachments || [],
      milestones: updatedProposal.milestones.map((m) => ({
        _id: m._id.toString(),
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: m.dueDate,
        status: m.status,
        paymentId: m.paymentId?.toString(),
        paymentRequestId: m.paymentRequestId?.toString(),
        deliverables: m.deliverables
          ? {
              links: m.deliverables.links,
              comments: m.deliverables.comments,
              submittedAt: m.deliverables.submittedAt,
              feedback: m.deliverables.feedback,
            }
          : undefined,
      })),
      payments: updatedProposal.payments.map((p) => p.toString()),
      status: updatedProposal.status,
      contractId: updatedProposal.contractId?.toString(),
      agreeNDA: updatedProposal.agreeNDA,
      agreeVideoCall: updatedProposal.agreeVideoCall,
      createdAt: updatedProposal.createdAt,
      updatedAt: updatedProposal.updatedAt,
    };
  }

  async findProposal(
    milestoneId: string,
    session: mongoose.ClientSession
  ): Promise<IProposalMilestoneResult | null> {
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
      deliverables: milestone.deliverables
        ? {
            links: milestone.deliverables.links,
            comments: milestone.deliverables.comments,
            submittedAt: milestone.deliverables.submittedAt,
            feedback: milestone.deliverables.feedback,
          }
        : undefined,
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
  ): Promise<IPaymentRequestResponse> {
    const [paymentRequest] = await PaymentRequestModel.create(
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

    return {
      _id: paymentRequest._id,
      jobId: paymentRequest.jobId,
      proposalId: paymentRequest.proposalId,
      milestoneId: paymentRequest.milestoneId,
      amount: paymentRequest.amount,
      platformFee: paymentRequest.platformFee,
      netAmount: paymentRequest.netAmount,
      status: paymentRequest.status,
      freelancerId: paymentRequest.freelancerId,
      clientId: paymentRequest.clientId,
      createdAt: paymentRequest.createdAt,
      updatedAt: paymentRequest.updatedAt,
    };
  }

  async updatePaymentID(
    milestoneId: string,
    paymentRequestId: any,
    session: mongoose.ClientSession
  ): Promise<void> {
    await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.paymentRequestId": paymentRequestId } },
      { session }
    );
  }

  async proposalMilestonesReject(
    milestoneId: string
  ): Promise<ProposalMilestonesRejectResponse | null> {
    const proposal = await ProposalModel.findOneAndUpdate(
      { "milestones._id": milestoneId },
      { $set: { "milestones.$.status": "rejected" } },
      { new: true }
    );

    if (!proposal) return null;

    return {
      _id: proposal._id,
      freelancerId: proposal.freelancerId,
      jobId: proposal.jobId,
      job_Id: proposal.job_Id,
      coverLetter: proposal.coverLetter,
      budgetType: proposal.budgetType,
      bidAmount: proposal.bidAmount,
      estimatedTime: proposal.estimatedTime,
      workSamples: proposal.workSamples,
      PortfolioAttachments: proposal.PortfolioAttachments,
      milestones: proposal.milestones.map((m) => ({
        _id: m._id,
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: m.dueDate,
        status: m.status,
        paymentId: m.paymentId?.toString(),
        paymentRequestId: m.paymentRequestId?.toString(),
        deliverables: m.deliverables
          ? {
              links: m.deliverables.links,
              comments: m.deliverables.comments,
              submittedAt: m.deliverables.submittedAt,
              feedback: m.deliverables.feedback,
            }
          : undefined,
      })),
      payments: proposal.payments,
      status: proposal.status,
      contractId: proposal.contractId,
      agreeNDA: proposal.agreeNDA,
      agreeVideoCall: proposal.agreeVideoCall,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
    };
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
          status: "pending",
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
export interface IPaymentRequestWithPagination {
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
