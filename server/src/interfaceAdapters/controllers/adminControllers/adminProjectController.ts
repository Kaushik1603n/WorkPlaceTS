import { RequestHandler } from "express";
import { IAdminProjectUseCase } from "../../../useCase/Interface/IAdminProjectUseCase";
import { HttpStatus } from "../statusCode";
import { Messages } from "../messages";
export class AdminProjectController {
  private adminProject: IAdminProjectUseCase;
  constructor(usecase: IAdminProjectUseCase) {
    this.adminProject = usecase;
  }

  getActiveProject: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const { result, totalPage } =
        await this.adminProject.getAciveProjectUseCase(page, limit);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };
  getPostedProject: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const { result, totalPage } =
        await this.adminProject.getPostedProjectUseCase(page, limit);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };
  getCompletedProject: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const { result, totalPage } =
        await this.adminProject.getCompletedProjectUseCase(page, limit);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };
  ProjectDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const { jobId } = req.params;

      if (!jobId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: Messages.JOB_ID_REQUIRED,
        });
        return;
      }
      const result = await this.adminProject.ProjectDetailsUseCase(jobId);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "success", data: result });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };
}
