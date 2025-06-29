import mongoose from "mongoose";
import { ProposalRepo } from "../infrastructure/repositories/implementations/marketPlace/proposalRepo";
import { Server } from "socket.io";
import UserModel from "../domain/models/User";
import NotificationModel from "../domain/models/Notification";
import ProjectModel from "../domain/models/Projects";

export class ProposalUseCase {
  constructor(private proposal: ProposalRepo) {
    this.proposal = proposal;
  }

  async hireRequestUseCase(
    userId: string,
    proposalId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
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
        job_Id: proposal?.job_Id || new Date(),
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
        contract,
        session
      );

      if (!contractDetails[0]) {
        throw new Error("Contract not generated");
      }

      await this.proposal.findProposalAndUpdateStatus(
        proposalId,
        contractDetails[0]?._id,
        session
      );

      const client = await UserModel.findById(userId).session(session);

      await NotificationModel.create(
        [
          {
            userId: proposal.freelancerId,
            type: "contract",
            title: "Proposal Accepted",
            message: `Your proposal for the job "${proposal.jobTitle}" has been accepted by ${client?.fullName}.`,
            content: `Contract ID: ${contractDetails._id}`,
            isRead: false,
            actionLink: `/freelancer-dashboard/proposals`,
            metadata: {
              jobId: proposal.jobId,
              proposalId: proposalId,
              contractId: contractDetails._id,
              clientId: userId,
            },
            createdAt: new Date(),
          },
        ],
        { session }
      );
      const freelancerSocketId =
        connectedUsers[proposal.freelancerId.toString()];
      if (freelancerSocketId) {
        io.to(freelancerSocketId).emit("notification", {
          _id: contractDetails._id,
          userId: proposal.freelancerId.toString(),
          type: "contract",
          title: "Proposal Accepted",
          message: `Your proposal for the job "${proposal.jobTitle}" has been accepted by ${client?.fullName}.`,
          content: `Contract ID: ${contractDetails._id}`,
          isRead: false,
          actionLink: `/freelancer-dashboard/proposals`,
          metadata: {
            jobId: proposal.jobId,
            proposalId: proposalId,
            contractId: contractDetails._id,
            clientId: userId,
          },
          createdAt: new Date().toISOString(),
        });
        console.log(`Notification sent to freelancer ${proposal.freelancerId}`);
      } else {
        console.log(`Freelancer ${proposal.freelancerId} is not connected`);
      }

      await session.commitTransaction();

      return;
    } catch (error) {
      await session.abortTransaction();
      console.error(`creating proposal usecase error`, error);
      throw error;
    } finally {
      session.endSession();
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
      const contractDetails = await this.proposal.getContractDetailsNormal(
        contractId
      );

      return contractDetails;
    } catch (error) {
      console.error(`proposal usecase error`, error);
      throw error;
    }
  }

  async acceptProposalUseCase(
    userId: string,
    contractId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const contractDetails = await this.proposal.getContractDetailsWithSession(
        contractId,
        session
      );

      const proposal_id = contractDetails?.proposalId
        ? contractDetails?.proposalId
        : "";

      if (
        contractDetails?.freelancerId.toString() !== userId.toString() ||
        contractDetails?.status === "reject"
      ) {
        throw new Error("You cannot accept this proposal");
      }

      const jobId = contractDetails?.jobId ? contractDetails.jobId : "";

      const jobStatus = await this.proposal.getJobStatus(
        jobId as string,
        session
      );

      if (jobStatus?.status !== "posted" && jobStatus?.status !== "draft") {
        throw new Error("Cannot Accept this Contract");
      }

      const contract = await this.proposal.acceptProposalContract(
        userId,
        jobId as string,
        proposal_id as string,
        contractId,
        session
      );

      // Fetch freelancer data for notification
      const freelancer = await UserModel.findById(userId).session(session);

      // Create notification in database
      await NotificationModel.create(
        [
          {
            userId: contractDetails.clientId,
            type: "contract",
            title: "Contract Accepted",
            message: `Freelancer ${freelancer?.fullName} has accepted the contract for your job "${contractDetails.title}".`,
            content: `Contract ID: ${contractId}`,
            isRead: false,
            actionLink: `/client-dashboard/active-project`,
            metadata: {
              jobId: jobId,
              proposalId: proposal_id,
              contractId: contractId,
              freelancerId: userId,
            },
            createdAt: new Date(),
          },
        ],
        { session }
      );

      // Emit real-time Socket.IO notification
      const clientSocketId =
        connectedUsers[contractDetails.clientId.toString()];
      if (clientSocketId) {
        io.to(clientSocketId).emit("notification", {
          _id: contractId,
          userId: contractDetails.clientId.toString(),
          type: "contract",
          title: "Contract Accepted",
          message: `Freelancer ${freelancer?.fullName} has accepted the contract for your job "${contractDetails.title}".`,
          content: `Contract ID: ${contractId}`,
          isRead: false,
          actionLink: `/client-dashboard/active-project`,
          metadata: {
            jobId: jobId,
            proposalId: proposal_id,
            contractId: contractId,
            freelancerId: userId,
          },
          createdAt: new Date().toISOString(),
        });
        console.log(`Notification sent to client ${contractDetails.clientId}`);
      } else {
        console.log(`Client ${contractDetails.clientId} is not connected`);
      }

      await session.commitTransaction();

      return contract;
    } catch (error) {
      await session.abortTransaction();
      console.error(`proposal usecase error`, error);
      throw error;
    } finally {
      session.endSession();
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

  async proposalMilestonesApproveUseCase(
    milestoneId: string,
    userId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ) {
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

      const platformFee = (proposal.amount / 100) * 10;
      const netAmount = proposal.amount - platformFee;
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

      // Fetch job and client data for notification
      const job = await ProjectModel.findById(proposal.jobId).session(session);
      const client = await UserModel.findById(userId).session(session);

      if (!job || !client) {
        throw new Error("Job or client not found");
      }

      // Create notification in database
      await NotificationModel.create(
        [
          {
            userId: proposal.freelancerId,
            type: "milestone",
            title: "Milestone Approved",
            message: `Client ${client.fullName} has approved your milestone for the job "${job.title}".`,
            content: `Milestone ID: ${milestoneId}`,
            isRead: false,
            actionLink: `/freelancer-dashboard`,
            metadata: {
              jobId: proposal.jobId,
              milestoneId: milestoneId,
              proposalId: proposal._id,
              clientId: userId,
            },
            createdAt: new Date(),
          },
        ],
        { session }
      );

      // Emit real-time Socket.IO notification
      const freelancerSocketId =
        connectedUsers[proposal.freelancerId.toString()];
      if (freelancerSocketId) {
        io.to(freelancerSocketId).emit("notification", {
          _id: milestoneId,
          userId: proposal.freelancerId.toString(),
          type: "milestone",
          title: "Milestone Approved",
          message: `Client ${client.fullName} has approved your milestone for the job "${job.title}".`,
          content: `Milestone ID: ${milestoneId}`,
          isRead: false,
          actionLink: `/freelancer-dashboard`,
          metadata: {
            jobId: proposal.jobId,
            milestoneId: milestoneId,
            proposalId: proposal._id,
            clientId: userId,
          },
          createdAt: new Date().toISOString(),
        });
        console.log(`Notification sent to freelancer ${proposal.freelancerId}`);
      } else {
        console.log(`Freelancer ${proposal.freelancerId} is not connected`);
      }

      await session.commitTransaction();

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

  async pendingPamentsUseCase(userId: string, page: number, limit: number) {
    const data = await this.proposal.findPayment(userId, page, limit);
    return data;
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
