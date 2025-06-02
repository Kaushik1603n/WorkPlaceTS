import { RequestHandler } from "express";
import { UserUseCase } from "../../../useCase/admin/userUseCase";
import { UserDataRepo } from "../../../infrastructure/repositories/implementations/adminRepos/userDataRepo";

const userRepo = new UserDataRepo();
const userData = new UserUseCase(userRepo);

export class UserDataController {
  getFreelancerData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";
      const data = await userData.getFreelancerData(page, limit, search);

      res.status(200).json({ success: true, message: "success", data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  getClientData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";
      const data = await userData.getClientData(page, limit, search);

      res.status(200).json({ success: true, message: "success", data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  getUsersData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const data = await userData.getUsersData(page, limit, search);

      res.status(200).json({ success: true, message: "success", data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  userAction: RequestHandler = async (req, res): Promise<any> => {
    const { userId, status } = req.body;
    await userData.userAction(userId, status);

    res.status(200).json({ success: true, message: "success" });
  };
}
