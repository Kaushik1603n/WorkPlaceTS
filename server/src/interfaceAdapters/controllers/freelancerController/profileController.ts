import { RequestHandler } from "express";
import { IFreelancerProfileUseCase } from "../../../useCase/Interface/IFreelancerProfileUseCase";
import { Messages } from "../messages";
import { HttpStatus } from "../statusCode";

export class freelancerProfileControllers {
  private freelancerUseCase:IFreelancerProfileUseCase;
  constructor(usecase:IFreelancerProfileUseCase){
    this.freelancerUseCase=usecase;
  }
  
  profileEdit: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_USERID });
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
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: { message: Messages.EMAIL_FullName_REQUIRED },
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

      res.status(HttpStatus.OK).json({
        message: "Profile updated successfully",
        user: updatedUser,
        freelancer: freelancer,
      });
    } catch (error) {
      console.error("Error in profileEdit:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
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

      const freelancer = await this.freelancerUseCase.profileDetails(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        freelancer: freelancer,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
      }
    }
  };
  
  client: RequestHandler = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const { page = "1", limit = "5" } = req.query;

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const { clients, pagination } = await this.freelancerUseCase.clientUseCase(
        pageNum,
        limitNum
      );

      res.status(HttpStatus.OK).json({
        success: true,
        clients: clients,
        pagination,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  getTickets: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const { result, totalPages } =
        await this.freelancerUseCase.freelancerTicketUseCase(userId, page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        totalPages,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  totalcount: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.freelancerUseCase.totalcountUseCase(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  totalEarnings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.freelancerUseCase.totalEarningsUseCase(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };

  dashboardProject: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.freelancerUseCase.dashboardProjectUseCase(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Error in get client profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SERVER_ERROR });
    }
  };
}
