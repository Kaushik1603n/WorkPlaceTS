import { RequestHandler } from "express";
// import { UserUseCase } from "../../../useCase/admin/userUseCase";
// import { UserDataRepo } from "../../../infrastructure/repositories/implementations/adminRepos/userDataRepo";
import { IAdminUserUseCase } from "../../../useCase/Interface/IAdminUserUseCase";

// const userRepo = new UserDataRepo();
// const userData = new UserUseCase(userRepo);

export class UserDataController {
  private userData: IAdminUserUseCase;
  constructor(usecasse: IAdminUserUseCase) {
    this.userData = usecasse;
  }

  getFreelancerData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";
      const data = await this.userData.getFreelancerData(page, limit, search);

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
      const data = await this.userData.getClientData(page, limit, search);

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

      const data = await this.userData.getUsersData(page, limit, search);

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
    await this.userData.userAction(userId, status);

    res.status(200).json({ success: true, message: "success" });
  };

  clientDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error("UserId not Found");
      }

      const clientDetails = await this.userData.clientDetails(userId);

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

      const freelancerDetails = await this.userData.freelancerDetails(userId);

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

      await this.userData.userVerification(userId, status);

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

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { result, totalPages } = await this.userData.AllReportUseCase(
        page,
        limit
      );

      res.status(200).json({ data: result || [], totalPages });
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

      const report = await this.userData.TicketStatusUseCase(
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

      const report = await this.userData.TicketStatusCommentUseCase(
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

  UserGrowthData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { result, totalUsers } =
        await this.userData.UserGrowthDataUseCase();

      res.status(200).json({ success: true, data: result || [], totalUsers });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  TopFreelancer: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.userData.TopFreelancerUseCase();

      res.status(200).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  AllJobcount: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.userData.AllJobcountUseCase();

      res.status(200).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  AllJobDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.userData.AllJobDetailsUseCase();

      res.status(200).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  RevenueData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { revenueData, revenueDetails } =
        await this.userData.RevenueDataUseCase();

      res
        .status(200)
        .json({ success: true, data: revenueData || [], revenueDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  Payments: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const payment = await this.userData.PaymentsUseCase(page, limit);

      res.status(200).json({ success: true, payment: payment || [] });
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
