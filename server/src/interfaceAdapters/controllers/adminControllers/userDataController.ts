import { RequestHandler } from "express";
import { IAdminUserUseCase } from "../../../useCase/Interface/IAdminUserUseCase";
import { Messages } from "../messages";
import { HttpStatus } from "../statusCode";

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

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.SUCCESS, data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  getClientData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";
      const data = await this.userData.getClientData(page, limit, search);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.SUCCESS, data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  getUsersData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const data = await this.userData.getUsersData(page, limit, search);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.SUCCESS, data });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  userAction: RequestHandler = async (req, res): Promise<any> => {
    const { userId, status } = req.body;
    await this.userData.userAction(userId, status);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.SUCCESS });
  };

  clientDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error(Messages.INVALID_USERID);
      }

      const clientDetails = await this.userData.clientDetails(userId);

      res.status(HttpStatus.OK).json({ data: clientDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  freelancerDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error(Messages.INVALID_USERID);
      }

      const freelancerDetails = await this.userData.freelancerDetails(userId);

      res.status(HttpStatus.OK).json({ data: freelancerDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  userVerification: RequestHandler = async (req, res): Promise<any> => {
    try {
      const userId = req.params.userId;
      const { status } = req.body;

      if (!userId) {
        throw new Error(Messages.INVALID_USERID);
      }
      if (!status) {
        throw new Error("Status not Found");
      }

      await this.userData.userVerification(userId, status);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Update Verification Status", status });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  AllReport: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { result, totalPages } = await this.userData.AllReportUseCase(
        page,
        limit
      );

      res.status(HttpStatus.OK).json({ data: result || [], totalPages });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  TicketStatus: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const ticketId = req.params.ticketId;

      const { status } = req.body;

      const report = await this.userData.TicketStatusUseCase(
        status,
        ticketId,
        userId
      );

      res.status(HttpStatus.OK).json({ data: report || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  TicketStatusComment: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const ticketId = req.params.ticketId;
      const { text } = req.body;

      const report = await this.userData.TicketStatusCommentUseCase(
        text,
        ticketId,
        userId
      );

      res.status(HttpStatus.OK).json({ data: report || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  UserGrowthData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const { result, totalUsers } =
        await this.userData.UserGrowthDataUseCase();
      const freelancersRes = await this.userData.TopFreelancerUseCase();
      const jobGrowthRes = await this.userData.AllJobcountUseCase();
      const jobDetailsRes = await this.userData.AllJobDetailsUseCase();
      const { revenueData, revenueDetails } =
        await this.userData.RevenueDataUseCase();

      res
        .status(HttpStatus.OK)
        .json({
          success: true,
          userGrowthRes: result || [],
          totalUsers,
          freelancersRes,
          jobGrowthRes,
          jobDetailsRes,
          revenueData,
          revenueDetails,
        });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  TopFreelancer: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.userData.TopFreelancerUseCase();

      res.status(HttpStatus.OK).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  AllJobcount: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.userData.AllJobcountUseCase();

      res.status(HttpStatus.OK).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  AllJobDetails: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const result = await this.userData.AllJobDetailsUseCase();

      res.status(HttpStatus.OK).json({ success: true, data: result || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  RevenueData: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const { revenueData, revenueDetails } =
        await this.userData.RevenueDataUseCase();

      res
        .status(HttpStatus.OK)
        .json({ success: true, data: revenueData || [], revenueDetails });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };

  Payments: RequestHandler = async (req, res): Promise<any> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const payment = await this.userData.PaymentsUseCase(page, limit);

      res.status(HttpStatus.OK).json({ success: true, payment: payment || [] });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: Messages.SERVER_ERROR });
      }
    }
  };
}
