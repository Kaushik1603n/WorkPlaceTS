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
import FreelancerProfile from "../../../../domain/models/FreelancerProfile";
import { ProposalResponse } from "../../../../domain/dto/proposalDTO";
import {
  allProjectsInfoDTO,
  ReturnAllProjectsInfoDTO,
} from "../../../../domain/dto/projectDTO/getProjectAllInformationDTO";
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
      const jobExists = await ProjectModel.findById({
        _id: proposalData.jobId,
      });
      if (!jobExists) {
        throw new Error("Job not found");
      }

      const clientId = jobExists?.clientId;

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
      const freelancer = await UserModel.findById(userId);

      await NotificationModel.create(
        [
          {
            userId: clientId,
            type: "proposal",
            title: "New Job Proposal",
            message: `A new proposal has been submitted for your job  by freelancer ${freelancer?.fullName}.`,
            content: `Proposal ID: ${result[0]._id}`,
            isRead: false,
            actionLink: `/client-dashboard/jobs/${result[0]._id}/proposals`, // Adjust actionLink as needed
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

  async findProposalDetails(jobId: string) {
    const proposal = await ProjectModel.findById(jobId);
    return proposal;
  }

  async findFreelancerData(userId: string) {
    const freelancer = await UserModel.findById(userId);
    return freelancer;
  }

  async findProposalById(proposalId: string) {
    const proposalDetails = await ProposalModel.findById(proposalId)
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
      proposal_id: proposalDetails?._id,
      status: proposalDetails?.status,
      timeline: proposalDetails?.estimatedTime,
      bidAmount: proposalDetails?.bidAmount,
      bidType: proposalDetails?.budgetType,
      coverLetter: proposalDetails?.coverLetter,
      milestones: proposalDetails?.milestones || [],
      freelancerId: proposalDetails?.freelancerId?._id,
      freelancerName: proposalDetails?.freelancerId?.fullName,
      freelancerEmail: proposalDetails?.freelancerId?.email,
      jobTitle: proposalDetails?.jobId?.title,
      clientId: proposalDetails?.jobId?.clientId,
      submittedAt: proposalDetails?.createdAt,
    };
  }
  async findFreelancerById(userId: any) {
    const freelancerDetails = await FreelancerProfile.findOne(
      {
        userId: userId,
      },
      { profilePic: 1, skills: 1 }
    );
    return freelancerDetails;
  }

  async findActiveProject(userId: string): Promise<freelancerProject> {
    const allProjects = await ProjectModel.find(
      { hiredFreelancer: userId },
      {
        contractId: 1,
        budget: 1,
        budgetType: 1,
        time: 1,
        status: 1,
        title: 1,
        description: 1,
      }
    ).lean<freelancerProject>();

    return allProjects;
  }

  async getProjectAllInformation(
    jobId: string
  ): Promise<ReturnAllProjectsInfoDTO> {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(
        jobId
      ).lean<allProjectsInfoDTO>();
      const client = await UserModel.findById(project?.clientId, {
        fullName: 1,
        email: 1,
      }).lean<{ _id: string; fullName: string; email: string }>();

      const result: ReturnAllProjectsInfoDTO = {
        jobId: project?._id,
        title: project?.title,
        description: project?.description,
        stack: project?.stack,
        time: project?.time,
        reference: project?.reference,
        requiredFeatures: project?.requiredFeatures,
        hiredFreelancer: project?.hiredFreelancer,
        hiredProposalId: project?.hiredProposalId,
        budgetType: project?.budgetType,
        budget: project?.budget,
        clientId: client?._id,
        clientEmail: client?.email,
        clientFullName: client?.fullName,
      };
      return result;
    } catch (error) {
      console.error(`[findProjectDetails] DB error for job ${jobId}:`, error);
      throw error;
    }
  }

  async ProposalAllInfo(proposal_id: string) {
    const proposal = await ProposalModel.findById(proposal_id, {
      _id: 1,
      coverLetter: 1,
      milestones: 1,
      bidAmount: 1,
      budgetType: 1,
      estimatedTime: 1,
      status: 1,
      contractId: 1,
      payments: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return proposal;
  }
}

interface freelancerProject {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}
