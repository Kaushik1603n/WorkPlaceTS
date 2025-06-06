import { RequestHandler } from "express";
import { MarketPlaceUseCase } from "../../../useCase/MarketPlaceUseCase";
import { marketPlaceRepo } from "../../../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import { BidRequest } from "../../../domain/dto/projectDTO/jobProposalDTO";
// import ProjectModel from "../../../domain/models/Projects";
import { Server } from "socket.io";

const marketRepo = new marketPlaceRepo();
const marketPlace = new MarketPlaceUseCase(marketRepo);

type JobQueryParams = {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  duration?: string;
};
export class MarketPlaceProjectController {

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

      const { result, pagination } = await marketPlace.getAllProjectDetails({
        search,
        minPrice,
        maxPrice,
        jobTypes,
        skills,
        experienceLevel,
        page,
        limit,
      });

      res.status(200).json({ success: true, data: result, pagination });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch projects" });
    }
  };

  getProjectDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        res.status(400).json({
          success: false,
          error: "Job ID is required",
        });
        return;
      }

      const result = await marketPlace.getProjectDetails(jobId);

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Job details fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch job details";

      res.status(500).json({
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
        res.status(401).json({ message: "user not authenticated" });
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
        throw new Error("All Field are Require");
      }
      
      // Emit Socket.IO notification
      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } = req.app.get("connectedUsers");

      const result = await marketPlace.jobProposalUseCase(proposalData, userId,io,connectedUsers);

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Job not found",
        });
        return;
      }


      res.status(200).json({ success: true, message: "Proposal submitted" });
    } catch (error) {
      console.error("Proposal submission error:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const errorMessage =
        error instanceof Error ? error.message : "Proposal submission failed";

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
      return;
    }
  };
}
