import { RequestHandler } from "express";
import { ClientProjectUserCase } from "../../../useCase/clientProjectUseCase";
import { ProjectRepo } from "../../../infrastructure/repositories/implementations/clientRepos/clientProjectRepo";

const project = new ProjectRepo();
const projectUserCase = new ClientProjectUserCase(project);

export class ProjectController {
  newProject: RequestHandler = async (req, res): Promise<void> => {
    const {
      jobTitle,
      description,
      requiredFeatures,
      stack,
      skills,
      time,
      budgetType,
      budget,
      experienceLevel,
      reference,
    } = req.body;
    const { userId } = req.user as { userId: string; email: string };
    try {
      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      if (
        !jobTitle ||
        !description ||
        !requiredFeatures ||
        !stack ||
        !skills ||
        !time ||
        !budgetType ||
        !budget ||
        !experienceLevel ||
        !reference
      ) {
        throw new Error("All Feild are require");
      }
      await projectUserCase.newProject(
        userId,
        jobTitle,
        description,
        requiredFeatures,
        stack,
        skills,
        time,
        budgetType,
        budget,
        experienceLevel,
        reference
      );
      res
        .status(200)
        .json({ success: true, message: "Project created successfully" });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "User Verification faild" });
      }
    }
  };

  getAllProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId } = req.user as { userId: string; email: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const { project, totalPage, totalCount } =
        await projectUserCase.getProjectUseCase(userId, page, limit);
      res.status(200).json({
        success: true,
        message: "Project get successfully",
        data: project,
        totalPage,
        totalCount,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "User Verification faild" });
      }
    }
  };
  getAllTickets: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId } = req.user as { userId: string; email: string };
      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { result, totalPages } = await projectUserCase.getAllTicketUseCase(
        userId,
        page,
        limit
      );
      res.status(200).json({
        success: true,
        message: "Project get successfully",
        data: result,
        totalPages,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "User Verification faild" });
      }
    }
  };
  TicketComment: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const ticketId = req.params.ticketId;
      const { text } = req.body;

      const report = await projectUserCase.TicketStatusCommentUseCase(
        text,
        ticketId,
        userId
      );

      res.status(200).json({ data: report || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
}
