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

  clientDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error("UserId not Found");
      }

      const clientDetails = await userData.clientDetails(userId);

      res.status(200).json({ data: clientDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  freelancerDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error("UserId not Found");
      }

      const freelancerDetails = await userData.freelancerDetails(userId);

      res.status(200).json({ data: freelancerDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  userVerification: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      const { status } = req.body;

      if (!userId) {
        throw new Error("UserId not Found");
      }
      if (!status) {
        throw new Error("Status not Found");
      }

      await userData.userVerification(userId, status);

      res
        .status(200)
        .json({ success: true, message: "Update Verification Status", status });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "User Verification faild" });
      }
    }
  };

  AllReport: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const report = await userData.AllReportUseCase();

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
  TicketStatus: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const ticketId = req.params.ticketId;

      const { status } = req.body;

      const report = await userData.TicketStatusUseCase(
        status,
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
  TicketStatusComment: RequestHandler = async (req, res): Promise<any> => {
    try {
      
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const ticketId = req.params.ticketId;
      const { text } = req.body;

      const report = await userData.TicketStatusCommentUseCase(text,ticketId,userId);

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
