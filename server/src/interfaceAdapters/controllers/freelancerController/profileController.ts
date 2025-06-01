import { RequestHandler } from "express";
import { FreelancerProfileUseCase } from "../../../useCase/freelancerProfileUseCase";
import { UserRepo } from "../../../infrastructure/repositories/implementations/userRepo";
import { FreelancerRepo } from "../../../infrastructure/repositories/implementations/freelancerRepos/freelancerRepos";

const user = new UserRepo();
const freelancer = new FreelancerRepo();
const freelancerUseCase = new FreelancerProfileUseCase(freelancer, user);

export class freelancerProfileControllers {
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

      const updatedUser = await freelancerUseCase.updateNameAndEmail(
        userId,
        fullName,
        email
      );

      const freelancer = await freelancerUseCase.freelancerProfileEdit(
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

      const freelancer = await freelancerUseCase.profileDetails(userId);

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
}
