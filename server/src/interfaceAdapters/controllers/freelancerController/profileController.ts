import { RequestHandler } from "express";
import { IFreelancerProfileUseCase } from "../../../useCase/Interface/IFreelancerProfileUseCase";

export class freelancerProfileControllers {
  private freelancerUseCase:IFreelancerProfileUseCase;
  constructor(usecase:IFreelancerProfileUseCase){
    this.freelancerUseCase=usecase;
  }
  profileEdit: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      const {
        fullName,
        email,
        availability,
        experience,
        education,
        hourlyRate,
        skills,
        location,
        reference,
        bio,
        coverPic,
        profilePic,
      } = req.body;

      if (!fullName || !email) {
        res.status(400).json({
          success: false,
          error: { message: "Full name and email are required" },
        });
        return;
      }

      const updatedUser = await this.freelancerUseCase.updateNameAndEmail(
        userId,
        fullName,
        email
      );

      const freelancer = await this.freelancerUseCase.freelancerProfileEdit(
        userId,
        availability,
        experience,
        education,
        hourlyRate,
        skills,
        location,
        reference,
        bio,
        coverPic,
        profilePic
      );

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
        freelancer: freelancer,
      });
    } catch (error) {
      console.error("Error in profileEdit:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  profileDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      // Get userId from authenticated user
      const userId = "userId" in req.user ? req.user.userId : req.user;
      if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
      }

      const freelancer = await this.freelancerUseCase.profileDetails(userId);

      res.status(200).json({
        success: true,
        freelancer: freelancer,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  client: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const { page = "1", limit = "5" } = req.query;

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const { clients, pagination } = await this.freelancerUseCase.clientUseCase(
        pageNum,
        limitNum
      );

      res.status(200).json({
        success: true,
        clients: clients,
        pagination,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get clients" });
    }
  };

  getTickets: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const { result, totalPages } =
        await this.freelancerUseCase.freelancerTicketUseCase(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
        totalPages,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get client details" });
    }
  };

  totalcount: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.freelancerUseCase.totalcountUseCase(userId);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get clients" });
    }
  };
  totalEarnings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.freelancerUseCase.totalEarningsUseCase(userId);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get clients" });
    }
  };
  dashboardProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await this.freelancerUseCase.dashboardProjectUseCase(userId);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get clients" });
    }
  };
}
