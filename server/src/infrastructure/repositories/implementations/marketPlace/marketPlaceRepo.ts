import mongoose, { isValidObjectId } from "mongoose";
import { Job } from "../../../../domain/interfaces/entities/Job";
import { IMarketPlace } from "../../../../domain/interfaces/IMarketPlaceRepo";
import ProjectModel from "../../../../domain/models/Projects";
import UserModel from "../../../../domain/models/User";
import { BidRequest } from "../../../../domain/dto/projectDTO/jobProposalDTO";
import ProposalModel from "../../../../domain/models/Proposal";
import NotificationModel from "../../../../domain/models/Notification";
import FreelancerProfile from "../../../../domain/models/FreelancerProfile";
import FeedbackModel from "../../../../domain/models/feedbackSchema";
import ReportModal from "../../../../domain/models/ReportModel";
import {
  freelancerProjectType,
  MarketPlaceClientProjectTypes,
  PaginatedJobResponseTypes,
  ProjectDetailsTypes,
} from "../../../../domain/types/MarketPlaceTypes";
import { JobProposalResponseTypes } from "../../../../domain/types/JobProposalTypes";
import { ProposalResponseTypes } from "../../../../domain/types/ProposalTypes";
import {
  allProjectsInfoTypes,
  ReturnAllProjectsInfoTypes,
} from "../../../../domain/types/getProjectAllInformationTypes";
import { FeedbackArguments, FeedbackTypes, ReportDataArgument } from "../../../../domain/types/FeedbackTypes";
export class marketPlaceRepo implements IMarketPlace {
  async findAllProjects(
    searchQuery: object,
    page: number,
    limit: number
  ): Promise<PaginatedJobResponseTypes> {
    const total = await ProjectModel.countDocuments(searchQuery);
    const result = await ProjectModel.find(searchQuery, {
      _id: 1,
      job_Id: 1,
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
      .sort({ createdAt: -1 });

    const jobs: Job[] = result.map((doc) => ({
      _id: doc._id.toString(),
      job_Id: doc.job_Id.toString(),
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

  async findProjectDetails(jobId: string): Promise<ProjectDetailsTypes> {
    if (!isValidObjectId(jobId)) {
      // From mongoose or custom check
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(jobId);
      const client = await UserModel.findById(project?.clientId);

      const result: ProjectDetailsTypes = {
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

  async findClientActiveProject(
    userId: string
  ): Promise<MarketPlaceClientProjectTypes> {
    const allProjects = await ProjectModel.find(
      { clientId: userId, status: "in-progress" },
      {
        contractId: 1,
        budget: 1,
        budgetType: 1,
        time: 1,
        status: 1,
        title: 1,
        description: 1,
      }
    ).sort({createdAt:-1}).lean<MarketPlaceClientProjectTypes>();

    return allProjects;
  }
  async findClientPendingProject(
    userId: string
  ): Promise<MarketPlaceClientProjectTypes> {
    const allProjects = await ProjectModel.find(
      { clientId: userId, status: "posted" },
      {
        contractId: 1,
        budget: 1,
        budgetType: 1,
        time: 1,
        status: 1,
        title: 1,
        description: 1,
      }
    ).sort({createdAt:-1}).lean<MarketPlaceClientProjectTypes>();

    return allProjects;
  }
  async findClientCompletedProject(
    userId: string
  ): Promise<MarketPlaceClientProjectTypes> {
    const allProjects = await ProjectModel.find(
      { clientId: userId, status: "completed" },
      {
        contractId: 1,
        budget: 1,
        budgetType: 1,
        time: 1,
        status: 1,
        title: 1,
        description: 1,
      }
    ).sort({createdAt:-1}).lean<MarketPlaceClientProjectTypes>();

    return allProjects;
  }

  async createNewJobProposal(
    proposalData: BidRequest,
    userId: string
  ): Promise<JobProposalResponseTypes> {
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

  async findProposalDetails(jobId: string): Promise<any> {
    const proposal = await ProjectModel.findById(jobId);
    return proposal;
  }

  async findFreelancerData(userId: string): Promise<any> {
    const freelancer = await UserModel.findById(userId);
    return freelancer;
  }

  async findProposalById(proposalId: string): Promise<any> {
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
      .lean<ProposalResponseTypes | null>();

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

  async findFreelancerById(userId: any): Promise<any> {
    const freelancerDetails = await FreelancerProfile.findOne(
      {
        userId: userId,
      },
      { profilePic: 1, skills: 1 }
    );
    return freelancerDetails;
  }

  async findActiveProject(userId: string): Promise<freelancerProjectType> {
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
    ).lean<freelancerProjectType>();

    return allProjects;
  }

  async getProjectAllInformation(
    jobId: string
  ): Promise<ReturnAllProjectsInfoTypes> {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(
        jobId
      ).lean<allProjectsInfoTypes>();
      const client = await UserModel.findById(project?.clientId, {
        fullName: 1,
        email: 1,
      }).lean<{ _id: string; fullName: string; email: string }>();

      const result: ReturnAllProjectsInfoTypes = {
        jobId: project?._id,
        title: project?.title,
        description: project?.description,
        stack: project?.stack,
        time: project?.time,
        reference: project?.reference,
        requiredFeatures: project?.requiredFeatures,
        hiredFreelancer: project?.hiredFreelancer,
        hiredProposalId: project?.hiredProposalId,
        paymentStatus: project?.paymentStatus,
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

  async ProposalAllInfo(proposal_id: string): Promise<any> {
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

  async submitMilestoneRepo(
    jobId: string,
    userId: string,
    milestoneId: string,
    comments: string,
    links: string[]
  ): Promise<any> {
    console.log(jobId, userId, milestoneId, comments, links);
    const proposal = await ProposalModel.findOne({
      jobId,
      freelancerId: userId,
    });

    if (!proposal) {
      throw new Error("Proposal not found ");
    }

    const result = await ProposalModel.findOneAndUpdate(
      { jobId, "milestones._id": milestoneId },
      {
        $set: {
          "milestones.$.deliverables": {
            links: links || [],
            comments: comments || "",
            submittedAt: new Date(),
          },
          "milestones.$.status": "submitted",
        },
      },
      { new: true }
    );

    return result;
  }
  async submitFeedbackRepo({
    ratings,
    feedback,
    overallRating,
    jobId,
    freelancerId,
    userId,
  }: FeedbackArguments):Promise<FeedbackTypes> {
    const result = await FeedbackModel.create({
      ratings: ratings,
      feedback,
      overallRating,
      jobId,
      freelancerId,
      clientId: userId,
    });

    return result;
  }
  async submitFreelacerReportRepo(reportData: ReportDataArgument) {
    try {
      const { clientId, clientEmail, title, description, userId, jobId } =
        reportData;

      const report = await ReportModal.create({
        client: {
          id: clientId,
          email: clientEmail,
        },
        title,
        description,
        reportedBy: userId,
        status: "open",
        jobId,
      });

      return report;
    } catch (error) {
      console.error("Error in submitFreelancerReport:", error);
      throw new Error("Failed to submit report");
    }
  }
}




