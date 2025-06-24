import { RequestHandler } from "express";
import { AdminProjectRepo } from "../../../infrastructure/repositories/implementations/adminRepos/adminProjectRepo";
import { AdminProjectUseCase } from "../../../useCase/admin/adminProjectUseCase";

const projectRepo = new AdminProjectRepo();
const adminProject = new AdminProjectUseCase(projectRepo);
export class AdminProjectController {
  getActiveProject: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const { result, totalPage } = await adminProject.getAciveProjectUseCase(
        page,
        limit
      );

      res
        .status(200)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
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
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const { result, totalPage } = await adminProject.getPostedProjectUseCase(
        page,
        limit
      );

      res
        .status(200)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
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
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const { result, totalPage } =
        await adminProject.getCompletedProjectUseCase(page, limit);

      res
        .status(200)
        .json({ success: true, message: "success", data: result, totalPage });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  ProjectDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { jobId } = req.params;

      if (!jobId) {
        res.status(400).json({
          success: false,
          error: "Job ID is required",
        });
        return;
      }
      const result = await adminProject.ProjectDetailsUseCase(jobId);

      res.status(200).json({ success: true, message: "success", data: result });
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
