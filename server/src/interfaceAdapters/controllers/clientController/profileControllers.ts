import { RequestHandler } from "express";
import { IClinetProfileUseCase } from "../../../useCase/Interface/IClientProfileUseCase";
import { Messages } from "../messages";
import { HttpStatus } from "../statusCode";

export class profileCondroller {
  private clientProfileUserCase: IClinetProfileUseCase;
  constructor(usecase: IClinetProfileUseCase) {
    this.clientProfileUserCase = usecase;
  }

  profileEdit: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const userId = "userId" in req.user ? req.user.userId : req.user;
      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_USERID });
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
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: { message: Messages.EMAIL_FullName_REQUIRED },
        });
        return;
      }

      const updatedUser = await this.clientProfileUserCase.updateNameAndEmail(
        userId,
        fullName,
        email
      );

      const updatedClient = await this.clientProfileUserCase.clientProfileEdit(
        userId,
        companyName,
        description,
        location,
        website,
        coverPic,
        profilePic
      );

      res.status(HttpStatus.OK).json({
        message: "Profile updated successfully",
        user: updatedUser,
        client: updatedClient,
      });
    } catch (error) {
      console.error("Error in profileEdit:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  };

  profileDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const userId = "userId" in req.user ? req.user.userId : req.user;
      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_USERID });
        return;
      }

      const client = await this.clientProfileUserCase.profileDetails(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        client: client,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };
  freelancer: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const { page = "1", limit = "5" } = req.query;

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const { freelancers, pagination } =
        await this.clientProfileUserCase.freelancerUseCase(pageNum, limitNum);

      res.status(HttpStatus.OK).json({
        success: true,
        freelancer: freelancers,
        pagination,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  HiringProjects: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const { result, jobCount } =
        await this.clientProfileUserCase.HiringProjectsUseCase(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        result: result,
        jobCount,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  financialData: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const { weeklySpending, avgCostPerProject, totalSpent } =
        await this.clientProfileUserCase.FinancialDataUseCase(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        weeklySpending,
        avgCostPerProject,
        totalSpent,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };
}
