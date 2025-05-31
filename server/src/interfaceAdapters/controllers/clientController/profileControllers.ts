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
        CoverPic,
        profilePic,
      } = req.body;

      if (!fullName || !email) {
        res.status(400).json({
          success: false,
          error: { message: "Full name and email are required" },
        });
        return
      }

      // Update user name and email
      const updatedUser = await clientUseCase.updateNameAndEmail(
        userId,
        fullName,
        email
      );
      console.log("update", updatedUser);

      // Update client profile
      const updatedClient = await clientUseCase.profileDetails(
        userId,
        companyName,
        description,
        location,
        website,
        CoverPic,
        profilePic
      );

      console.log(updatedClient);

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
    console.log(req.body);
    console.log(res);
  };
}
