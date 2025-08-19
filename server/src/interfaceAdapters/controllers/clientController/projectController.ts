import { RequestHandler } from "express";
import { IClinetProjectUseCase } from "../../../useCase/Interface/IClientProjectUseCase";
import { HttpStatus } from "../statusCode";
import { Messages } from "../messages";
export class ProjectController {
  private projectUserCase: IClinetProjectUseCase;
  constructor(usecase: IClinetProjectUseCase) {
    this.projectUserCase = usecase;
  }

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
        throw new Error(Messages.INVALID_USER_AUTHENTICATED);
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
        throw new Error(Messages.ALL_FIELD);
      }
      await this.projectUserCase.newProject(
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
        .status(HttpStatus.OK)
        .json({ success: true, message: "Project created successfully" });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  getAllProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId } = req.user as { userId: string; email: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const { project, totalPage, totalCount } =
        await this.projectUserCase.getProjectUseCase(userId, page, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Project get successfully",
        data: project,
        totalPage,
        totalCount,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
    }
  };
  
  getAllTickets: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId } = req.user as { userId: string; email: string };
      if (!userId) {
        throw new Error(Messages.INVALID_USER_AUTHENTICATED);
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { result, totalPages } =
        await this.projectUserCase.getAllTicketUseCase(userId, page, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Project get successfully",
        data: result,
        totalPages,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  TicketComment: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const ticketId = req.params.ticketId;
      const { text } = req.body;

      const report = await this.projectUserCase.TicketStatusCommentUseCase(
        text,
        ticketId,
        userId
      );

      res.status(HttpStatus.OK).json({ data: report || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
    }
  };
}
