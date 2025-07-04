import { Server } from "socket.io";
import { BidRequest } from "../domain/dto/projectDTO/jobProposalDTO";
import { JobQueryParamsDTO } from "../domain/dto/projectDTO/marketPlaceDTO";
import ProjectModel from "../domain/models/Projects";
import { marketPlaceRepo } from "../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import mongoose, { FilterQuery } from "mongoose";
import UserModel from "../domain/models/User";
import NotificationModel from "../domain/models/Notification";

export class MarketPlaceUseCase {
  constructor(private market: marketPlaceRepo) {
    this.market = market;
  }
  async getAllProjectDetails({
    search = "",
    minPrice = 0,
    maxPrice = 10000,
    jobTypes = "",
    skills = "",
    experienceLevel = "",
    page = 1,
    limit = 5,
  }: JobQueryParamsDTO) {
    try {
      const query: FilterQuery<typeof ProjectModel> = {};
      const andConditions: any[] = [];

      if (search) {
        andConditions.push({
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        });
      }

      query.budget = {
        $gte: parseInt(minPrice as string),
        $lte: parseInt(maxPrice as string),
      };

      if (skills) {
        const skillsArray = skills.toLowerCase().split(",");
        andConditions.push({
          $or: skillsArray.map((skill) => ({
            skills: { $regex: skill.trim(), $options: "i" },
          })),
        });
      }

      if (jobTypes) {
        const typesArray = jobTypes.toLowerCase().split(",");
        andConditions.push({
          budgetType: { $in: typesArray },
        });
      }

      if (experienceLevel) {
        const levelsArray = experienceLevel.split(",");
        andConditions.push({
          $or: levelsArray.map((level) => ({
            experienceLevel: { $regex: level.trim(), $options: "i" },
          })),
        });
      }

      andConditions.push({ status: "posted" });

      if (andConditions.length > 0) {
        query.$and = andConditions;
      }

      return await this.market.findAllProjects(query, page, limit);
    } catch (error) {
      console.error("MarketPlace Usecase error:", error);
      throw error;
    }
  }

  async getProjectDetails(jobId: string) {
    if (!jobId || typeof jobId !== "string") {
      throw new Error("Invalid Job ID");
    }
    try {
      const result = await this.market.findProjectDetails(jobId);

      if (!result) {
        throw new Error("Job not found");
      }

      return result;
    } catch (error) {
      console.error(`[getProjectDetails] Error fetching job ${jobId}:`, error);
      throw error;
    }
  }

  async getActiveProjectUseCase(userId: string) {
    try {
      const result = await this.market.findClientActiveProject(userId);

      if (!result) {
        throw new Error("Jobs not found");
      }

      return result;
    } catch (error) {
      console.error("getActiveProjectUseCase ", error);
      throw error;
    }
  }
  async getPendingProjectUseCase(userId: string) {
    try {
      const result = await this.market.findClientPendingProject(userId);

      if (!result) {
        throw new Error("Jobs not found");
      }

      return result;
    } catch (error) {
      console.error("find Client Pending Project ", error);
      throw error;
    }
  }
  async getCompletedProjectUseCase(userId: string) {
    try {
      const result = await this.market.findClientCompletedProject(userId);

      if (!result) {
        throw new Error("Jobs not found");
      }

      return result;
    } catch (error) {
      console.error("getActiveProjectUseCase ", error);
      throw error;
    }
  }
  async jobProposalUseCase(
    proposalData: BidRequest,
    userId: string,
    io: Server,
    connectedUsers: { [key: string]: string }
  ) {
    try {
      const result = await this.market.createNewJobProposal(
        proposalData,
        userId
      );

      if (!result) {
        throw new Error("Proposal Faild");
      }

      const job = await this.market.findProposalDetails(proposalData.jobId);
      const freelancer = await this.market.findFreelancerData(userId);
      if (job && job?.clientId) {
        const clientSocketId = connectedUsers[job.clientId.toString()];
        if (clientSocketId) {
          io.to(clientSocketId).emit("notification", {
            _id: result.proposalId,
            userId: job.clientId.toString(),
            type: "proposal",
            title: "New Job Proposal",
            message: `A new proposal has been submitted for your job by freelancer ${freelancer?.fullName}.`,
            content: `Proposal ID: ${result.proposalId}`,
            isRead: false,
            actionLink: `/client-dashboard/jobs/${result.proposalId}/proposals`,
            metadata: {
              jobId: proposalData.jobId,
              proposalId: result.proposalId,
              freelancerId: userId,
            },
            createdAt: new Date().toISOString(),
          });
          console.log(`Notification sent to client ${job.clientId}`);
        } else {
          console.log(`Client ${job.clientId} is not connected`);
        }
      }

      return result;
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }
  async getProposalDetailsUseCase(userId: string, proposalId: string) {
    try {
      if (!userId && !proposalId) {
        throw new Error("Credensial missing");
      }

      const proposalDetails = await this.market.findProposalById(proposalId);

      if (!proposalId) {
        throw new Error("Proposal details not found");
      }

      if (proposalDetails?.clientId?.toString() !== userId) {
        throw new Error("You Can not access this page");
      }

      const freelancer = await this.market.findFreelancerById(
        proposalDetails?.freelancerId
      );

      const proposal = {
        ...proposalDetails,
        profile: freelancer?.profilePic || "",
        skills: freelancer?.skills || [],
      };

      return proposal;
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }

  async getAllJobDetailsUseCase(userId: string) {
    try {
      if (!userId) {
        throw new Error("Credensial missing");
      }

      const findProject = await this.market.findActiveProject(userId);

      return findProject;
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }

  async getProjectAllInformationUseCase(jobId: string, userId: string) {
    if (!jobId || typeof jobId !== "string") {
      throw new Error("Invalid Job ID");
    }
    try {
      const result = await this.market.getProjectAllInformation(jobId);
      if (!result) {
        throw new Error("Job not found");
      }

      if (result.hiredFreelancer?.toString() !== userId.toString()) {
        throw new Error("You cannot access this data");
      }

      const proposal = await this.market.ProposalAllInfo(
        result.hiredProposalId as string
      );

      return {
        jobDetails: result,
        proposalDetails: proposal,
      };
    } catch (error) {
      console.error(`[getProjectDetails] Error fetching job ${jobId}:`, error);
      throw error;
    }
  }
  async submitMilestoneUseCase(
    jobId: string,
    userId: string,
    milestoneId: string,
    comments: string,
    links: string[],
    io: Server,
    connectedUsers: { [key: string]: string }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!jobId || typeof jobId !== "string") {
        throw new Error("Invalid Job ID");
      }

      const result = await this.market.submitMilestoneRepo(
        jobId,
        userId,
        milestoneId,
        comments,
        links,
        session
      );
      if (!result) {
        throw new Error("Job not found");
      }

      const job = await ProjectModel.findById(jobId).session(session);
      const freelancer = await UserModel.findById(userId).session(session);

      if (!job || !freelancer) {
        throw new Error("Job or freelancer not found");
      }

      const milestone = result.milestones.find(
        (m: any) => m._id.toString() === milestoneId
      );

      if (!milestone) {
        throw new Error("Milestone not found in proposal");
      }

      await NotificationModel.create(
        [
          {
            userId: job.clientId,
            type: "milestone",
            title: "Milestone Submitted",
            message: `Freelancer ${freelancer.fullName} has submitted a milestone for the job "${job.title}".`,
            content: `Milestone ID: ${milestoneId}`,
            isRead: false,
            actionLink: `/client-dashboard/active-project/${jobId}`,
            metadata: {
              jobId: jobId,
              milestoneId: milestoneId,
              freelancerId: userId,
              proposalId: result._id,
            },
            createdAt: new Date(),
          },
        ],
        { session }
      );

      const clientSocketId = connectedUsers[job.clientId.toString()];
      if (clientSocketId) {
        io.to(clientSocketId).emit("notification", {
          _id: milestoneId,
          userId: job.clientId.toString(),
          type: "milestone",
          title: "Milestone Submitted",
          message: `Freelancer ${freelancer.fullName} has submitted a milestone for the job "${job.title}".`,
          content: `Milestone ID: ${milestoneId}`,
          isRead: false,
          actionLink: `/client-dashboard/active-project/${jobId}`,
          metadata: {
            jobId: jobId,
            milestoneId: milestoneId,
            freelancerId: userId,
            proposalId: result._id,
          },
          createdAt: new Date().toISOString(),
        });
        console.log(`Notification sent to client ${job.clientId}`);
      } else {
        console.log(`Client ${job.clientId} is not connected`);
      }

      await session.commitTransaction();

      return {
        jobDetails: result,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(
        `[submitMilestoneUseCase] Error submitting milestone for job ${jobId}:`,
        error
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
  async submitFeedbackCase(feedbackData: Feedback) {
    const { jobId, toUser, feedbackType } = feedbackData;

    if (!jobId || typeof jobId !== "string") {
      throw new Error("Invalid Job ID");
    }

    if (!toUser || typeof toUser !== "string") {
      throw new Error("Invalid toUser ID");
    }

    try {
      const result = await this.market.submitFeedbackRepo(feedbackData);
      if (!result) {
        throw new Error("Job not found");
      }

      const feedbacks = await this.market.findFeedbackRepo(
        toUser,
        feedbackType
      );
      let totalRating = 0;
      let qualityTotal = 0;
      let deadlinesTotal = 0;
      let professionalismTotal = 0;
      let clarityTotal = 0;
      let paymentTotal = 0;
      let communicationTotal = 0;

      feedbacks.forEach((fb: Feedback) => {
        totalRating += fb.overallRating;

        // For client-to-freelancer feedback
        if (fb.feedbackType === "client-to-freelancer") {
          qualityTotal += fb.ratings.quality || 0;
          deadlinesTotal += fb.ratings.deadlines || 0;
          professionalismTotal += fb.ratings.professionalism || 0;
        }
        // For freelancer-to-client feedback
        else {
          clarityTotal += fb.ratings.clarity || 0;
          paymentTotal += fb.ratings.payment || 0;
          communicationTotal += fb.ratings.communication || 0;
        }
      });

      const feedbackCount = feedbacks.length;
      const avgOverallRating = totalRating / feedbackCount;

      const updateData: any = {
        avgRating: avgOverallRating,
        feedbackCount,
      };

      // Add specific averages based on feedback type
      if (feedbackType === "client-to-freelancer") {
        updateData.freelancerRatings = {
          avgQuality: qualityTotal / feedbackCount,
          avgDeadlines: deadlinesTotal / feedbackCount,
          avgProfessionalism: professionalismTotal / feedbackCount,
        };
      } else {
        updateData.clientRatings = {
          avgClarity: clarityTotal / feedbackCount,
          avgPayment: paymentTotal / feedbackCount,
          avgCommunication: communicationTotal / feedbackCount,
        };
      }

      await this.market.findUserAndUpdateFeedback(toUser, updateData);

      return result;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw new Error("Failed to submit feedback");
    }
  }
  async submitFreelacerReportUseCase(reportData: IReportData) {
    try {
      const result = await this.market.submitFreelacerReportRepo(reportData);

      return result;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw new Error("Failed to submit feedback");
    }
  }
}

interface Feedback {
  ratings: {
    quality?: number;
    deadlines?: number;
    professionalism?: number;
    clarity?: number;
    payment?: number;
    communication?: number;
  };
  feedback: string;
  overallRating: number;
  jobId: string;
  fromUser: string;
  toUser: string;
  feedbackType: string;
}
interface IReportData {
  clientId: string;
  clientEmail: string;
  title: string;
  description: string;
  userId: string;
  jobId: string;
}
