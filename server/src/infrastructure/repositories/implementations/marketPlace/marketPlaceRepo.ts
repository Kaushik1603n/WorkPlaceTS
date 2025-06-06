import mongoose, { isValidObjectId } from "mongoose";
import {
  PaginatedJobResponseDTO,
  ProjectDetails,
} from "../../../../domain/dto/projectDTO/marketPlaceDTO";
import { Job } from "../../../../domain/interfaces/entities/Job";
import { IMarketPlace } from "../../../../domain/interfaces/IMarketPlaceRepo";
import ProjectModel from "../../../../domain/models/Projects";
import UserModel from "../../../../domain/models/User";
import {
  BidRequest,
  JobProposalResponse,
} from "../../../../domain/dto/projectDTO/jobProposalDTO";
import ProposalModel from "../../../../domain/models/Proposal";
import NotificationModel from "../../../../domain/models/Notification";
export class marketPlaceRepo implements IMarketPlace {
  async findAllProjects(
    searchQuery: object,
    page: number,
    limit: number
  ): Promise<PaginatedJobResponseDTO> {
    const total = await ProjectModel.countDocuments(searchQuery);
    const result = await ProjectModel.find(searchQuery, {
      _id: 1,
      title: 1,
      stack: 1,
      description: 1,
      skills: 1,
      budget: 1,
      proposals: 1,
      createdAt: 1,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });

    const jobs: Job[] = result.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title,
      stack: doc.stack,
      description: doc.description,
      skills: doc.skills,
      budget: doc.budget,
      proposals: doc.proposals?.map(String) ?? [],
      createdAt: doc.createdAt.toISOString(),
    }));

    return {
      result: jobs,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }

  async findProjectDetails(jobId: string): Promise<ProjectDetails> {
    if (!isValidObjectId(jobId)) {
      // From mongoose or custom check
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(jobId);
      const client = await UserModel.findById(project?.clientId);

      const result: ProjectDetails = {
        title: project?.title,
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

  async createNewJobProposal(
    proposalData: BidRequest,
    userId: string
  ): Promise<JobProposalResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if job exists first
      const jobExists = await ProjectModel.findById({ _id: proposalData.jobId });
      if (!jobExists) {
        throw new Error("Job not found");
      }

      const clientId = jobExists?.clientId

      const result = await ProposalModel.create(
        [
          {
            freelancerId: userId,
            jobId: proposalData.jobId,
            coverLetter: proposalData.coverLetter,
            budgetType: proposalData.bidType,
            bidAmount: proposalData.bidAmount,
            estimatedTime: proposalData.timeline,
            workSamples: proposalData.workSamples,
            milestones: proposalData.milestones,
            agreeVideoCall: proposalData.agreeVideoCall,
            agreeNDA: proposalData.agreeNDA,
          },
        ],
        { session }
      );

      await ProjectModel.findByIdAndUpdate(
        proposalData.jobId,
        { $push: { proposals: result[0]._id } },
        { session }
      );

      await NotificationModel.create(
        [
          {
            userId: clientId,
            type: "proposal",
            title: "New Job Proposal",
            message: `A new proposal has been submitted for your job (ID: ${proposalData.jobId}) by freelancer ${userId}.`,
            content: `Proposal ID: ${result[0]._id}`,
            isRead: false,
            actionLink: `/jobs/${proposalData.jobId}/proposals`, // Adjust actionLink as needed
            metadata: {
              jobId: proposalData.jobId,
              proposalId: result[0]._id,
              freelancerId: userId,
            },
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return {
        success: true,
        message: "Job proposal submitted successfully",
        proposalId: result[0]._id as string,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Database operation failed:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
