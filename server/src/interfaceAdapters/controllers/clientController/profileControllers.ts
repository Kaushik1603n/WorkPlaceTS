import { RequestHandler } from "express";
import { ClientProfileUserCase } from "../../../useCase/clientProfileUseCase";
import { UserRepo } from "../../../infrastructure/repositories/implementations/userRepo";
import { ClientRepo } from "../../../infrastructure/repositories/implementations/clientRepos/clientProfileRepo";
// import { AuthUseCase } from "../../../useCase/authUseCase";

const user = new UserRepo();
const client = new ClientRepo();
const clientUseCase = new ClientProfileUserCase(client, user);
// const useCase = new AuthUseCase(user);

export class profileCondroller {
  profileEdit: RequestHandler = async (req, res): Promise<void> => {
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

      const {
        companyName,
        description,
        email,
        fullName,
        location,
        website,
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

      // Update user name and email
      const updatedUser = await clientUseCase.updateNameAndEmail(
        userId,
        fullName,
        email
      );

      // Update client profile
      const updatedClient = await clientUseCase.clientProfileEdit(
        userId,
        companyName,
        description,
        location,
        website,
        coverPic,
        profilePic
      );
      // console.log(updatedClient);
      

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
        client: updatedClient,
      });
    } catch (error) {
      console.error("Error in profileEdit:", error);
      res.status(500).json({ message: "Internal server error" });
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

      const client = await clientUseCase.profileDetails(userId);

      res.status(200).json({
        success: true,
        client: client,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get client details" });
    }
  };
  freelancer: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const { page = "1", limit = "5" } = req.query;

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const { freelancers, pagination } = await clientUseCase.freelancerUseCase(
        pageNum,
        limitNum
      );

      res.status(200).json({
        success: true,
        freelancer: freelancers,
        pagination,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get client details" });
    }
  };

  HiringProjects: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const { result, jobCount } = await clientUseCase.HiringProjectsUseCase(
        userId
      );

      res.status(200).json({
        success: true,
        result: result,
        jobCount,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get client details" });
    }
  };

  financialData: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const { weeklySpending, avgCostPerProject, totalSpent } =
        await clientUseCase.FinancialDataUseCase(userId);

      res.status(200).json({
        success: true,
        weeklySpending,
        avgCostPerProject,
        totalSpent,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(500).json({ error: "can not get client details" });
    }
  };
}
