import { RequestHandler } from "express";
import { BidRequest } from "../../../domain/dto/projectDTO/jobProposalDTO";
import { Server } from "socket.io";
import { IMarketPlaceUseCase } from "../../../useCase/Interface/IMarketPlaceUseCase";
import { HttpStatus } from "../statusCode";
import { Messages } from "../messages";
export class MarketPlaceProjectController {
  private marketPlace: IMarketPlaceUseCase;
  constructor(usecase: IMarketPlaceUseCase) {
    this.marketPlace = usecase;
  }

  getAllMarketProjects: RequestHandler = async (req, res): Promise<void> => {
    try {
      const {
        search = "",
        minPrice = 0,
        maxPrice = 10000,
        jobTypes = "",
        skills = "",
        experienceLevel = "",
      } = req.query as JobQueryParams;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { result, pagination } =
        await this.marketPlace.getAllProjectDetails({
          search,
          minPrice,
          maxPrice,
          jobTypes,
          skills,
          experienceLevel,
          page,
          limit,
        });

      res
        .status(HttpStatus.OK)
        .json({ success: true, data: result, pagination });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: Messages.SERVER_ERROR });
    }
  };

  activeClientProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const [active, pending, completed] = await Promise.all([
        this.marketPlace.getActiveProjectUseCase(userId) || [],
        this.marketPlace.getPendingProjectUseCase(userId) || [],
        this.marketPlace.getCompletedProjectUseCase(userId) || [],
      ]);

      if (!active || !pending || !completed) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        active: active || [],
        pending: pending || [],
        completed: completed || [],
      });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  pendingClientProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.marketPlace.getPendingProjectUseCase(userId);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  completedClientProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.marketPlace.getCompletedProjectUseCase(userId);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  getProjectDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Job ID is required",
        });
        return;
      }

      const result = await this.marketPlace.getProjectDetails(jobId);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  setProjectStatus: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { jobId } = req.params;
      const { status } = req.query;

      if (!jobId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Job ID is required",
        });
        return;
      }

      if (
        typeof status !== "string" ||
        !["posted", "De-active"].includes(status)
      ) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Invalid or missing status",
        });
        return;
      }

      const result = await this.marketPlace.getProjectDetails(jobId);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      if (result?.status && !["posted", "De-active"].includes(result?.status)) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Job status cannot update this stage",
        });
        return;
      }

      const updated = await this.marketPlace.updateJobStatus(jobId, status);

      res.status(HttpStatus.OK).json({ success: true, data: updated });
    } catch (error) {
      console.error("Job status update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  jobProposal: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const proposalData: BidRequest = req.body;

      if (
        !proposalData.agreeNDA ||
        !proposalData.agreeVideoCall ||
        !proposalData.coverLetter ||
        !proposalData.bidAmount ||
        !proposalData.timeline ||
        !proposalData.workSamples ||
        !proposalData.milestones ||
        !proposalData.bidType ||
        !proposalData.jobId
      ) {
        throw new Error(Messages.ALL_FIELD);
      }

      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } =
        req.app.get("connectedUsers");

      const result = await this.marketPlace.jobProposalUseCase(
        proposalData,
        userId,
        io,
        connectedUsers
      );

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Proposal submitted" });
    } catch (error) {
      console.error("Proposal submission error:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
      return;
    }
  };

  getProposalDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const proposalId = req.params.proposalId;

      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      if (!proposalId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: Messages.PROPOSAL_ID_REQUIRED });
        return;
      }

      const result = await this.marketPlace.getProposalDetailsUseCase(
        userId,
        proposalId
      );

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Proposal submitted", data: result });
    } catch (error) {
      console.error("Proposal submission error:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
      return;
    }
  };

  getAllFreelacerJobs: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.marketPlace.getAllJobDetailsUseCase(userId);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Project Details", data: result });
    } catch (error) {
      console.error("Project Details error:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
      return;
    }
  };

  getProjectAllInformation: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const { jobId } = req.params;
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!jobId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: Messages.JOB_ID_REQUIRED,
        });
        return;
      }

      const data = await this.marketPlace.getProjectAllInformationUseCase(
        jobId,
        userId
      );

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Job not found",
        });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  submitMilestone: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { jobId } = req.params;
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const { milestoneId, comments, links } = req.body;

      if (!userId) {
        throw new Error(Messages.INVALID_USER_AUTHENTICATED);
      }

      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } =
        req.app.get("connectedUsers");

      const data = await this.marketPlace.submitMilestoneUseCase(
        jobId,
        userId,
        milestoneId,
        comments,
        links,
        io,
        connectedUsers
      );

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Milestone not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, data: "" });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  submitFeedback: RequestHandler = async (req, res): Promise<void> => {
    try {
      const userData = req.user as { userId: string; email: string };
      const userId = userData.userId;
      if (!userId) {
        throw new Error(Messages.INVALID_USER_AUTHENTICATED);
      }

      const {
        ratings,
        feedback,
        overallRating,
        jobId,
        receverId,
        user,
      }: {
        ratings: {
          quality: number;
          deadlines: number;
          professionalism: number;
        };
        feedback: string;
        overallRating: number;
        jobId: string;
        receverId: string;
        user: string;
      } = req.body;

      if (!ratings || !overallRating || !jobId || !receverId) {
        throw new Error("Missing required fields");
      }

      const feedbackType =
        user === "client" ? "client-to-freelancer" : "freelancer-to-client";

      const feedbackData: {
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
      } = {
        ratings,
        feedback,
        overallRating,
        jobId,
        fromUser: userId,
        toUser: receverId,
        feedbackType,
      };

      const data = await this.marketPlace.submitFeedbackCase(feedbackData);

      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error("Feedback submission error:", error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: Messages.SERVER_ERROR,
      });
    }
  };

  freelacerReport: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        throw new Error(Messages.INVALID_USER_AUTHENTICATED);
      }

      const { clientId, clientEmail, title, description, jobId } = req.body;
      const reportData: IReportData = {
        clientId,
        clientEmail,
        title,
        description,
        userId,
        jobId,
      };

      const data = await this.marketPlace.submitFreelacerReportUseCase(
        reportData
      );

      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error("Report submission error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };
}

interface IReportData {
  clientId: string;
  clientEmail: string;
  title: string;
  description: string;
  userId: string;
  jobId: string;
}

type JobQueryParams = {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  duration?: string;
};
