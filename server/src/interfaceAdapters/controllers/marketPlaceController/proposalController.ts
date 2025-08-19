import { RequestHandler } from "express";
import { Server } from "socket.io";
import { IProposalUseCase } from "../../../useCase/Interface/IProposalUseCase";
import { Messages } from "../messages";
import { HttpStatus } from "../statusCode";

export class ProposalController {
  private proposalCase: IProposalUseCase;
  constructor(usecase: IProposalUseCase) {
    this.proposalCase = usecase;
  }

  hireRequest: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const proposalId = req.params.proposalId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      if (!proposalId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.PROPOSAL_ID_REQUIRED });
        return;
      }

      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } =
        req.app.get("connectedUsers");

      await this.proposalCase.hireRequestUseCase(
        userId,
        proposalId,
        io,
        connectedUsers
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Hire request processed successfully",
      });
    } catch (error) {
      console.error("Hire request error:", error);

      const message = error instanceof Error ? error.message.toLowerCase() : "";

      const statusCode = message.includes("not found")
        ? HttpStatus.NOT_FOUND
        : message.includes("de-active")
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  getAllFreelancerProposals: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const proposals =
        await this.proposalCase.getAllFreelancerProposalsUseCase(userId);

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  getAllPropjectProposals: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const jobId = req.params.id;

      if (!jobId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "jobId Require" });
        return;
      }
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const proposals = await this.proposalCase.getAllProjectProposalsUseCase(
        jobId
      );

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  getContractDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const contractDetails = await this.proposalCase.getContractDetailsUseCase(
        contractId
      );

      res.status(HttpStatus.OK).json({
        message: "Contract fetched successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  acceptProposalcontract: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } =
        req.app.get("connectedUsers");

      const contractDetails = await this.proposalCase.acceptProposalUseCase(
        userId,
        contractId,
        io,
        connectedUsers
      );

      res.status(HttpStatus.OK).json({
        message: "Contract Accept successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error("Accept proposal contract error:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorMessage =
        error instanceof Error ? error.message : Messages.SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  };

  rejectProposalcontract: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      const contractDetails = await this.proposalCase.rejectProposalUseCase(
        userId,
        contractId
      );

      res.status(HttpStatus.OK).json({
        message: "Contract Reject successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  proposalMilestones: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const jobId = req.params.jobId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      const data = await this.proposalCase.proposalMilestonesUseCase(jobId);

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  proposalMilestonesApprove: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const milestoneId = req.params.milestoneId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }

      const io: Server = req.app.get("io");
      const connectedUsers: { [key: string]: string } =
        req.app.get("connectedUsers");
      const data = await this.proposalCase.proposalMilestonesApproveUseCase(
        milestoneId,
        userId,
        io,
        connectedUsers
      );

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };
  
  proposalMilestonesReject: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const milestoneId = req.params.milestoneId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      const data = await this.proposalCase.proposalMilestonesRejectUseCase(
        milestoneId
      );

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  pendingPaments: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const {
        data,
        totalPages,
        totalCount,
        totalAmount,
        netAmount,
        platformFee,
        pendingAmount,
      } = await this.proposalCase.pendingPamentsUseCase(userId, page, limit);

      res.status(HttpStatus.OK).json({
        message: "Proposals fetched successfully",
        data: data,
        totalPages,
        totalCount,
        totalAmount,
        netAmount,
        platformFee,
        pendingAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  // milestonePayment: RequestHandler = async (req, res): Promise<void> => {
  //   try {

  //     const { amount, receipt } = req.body;

  //     const options = {
  //       amount: amount * 100, // Razorpay expects amount in paise (multiply by 100 for INR)
  //       currency: "INR",
  //       receipt: receipt,
  //       payment_capture: 1,
  //     };

  //     const order = await createOrder(options);

  //     // if (!userId) {
  //     //   throw new Error("User Not Authenticated");
  //     // }

  //     res.status(HttpStatus.OK).json({
  //       message: "Proposals fetched successfully",
  //       data: order
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       error:
  //         error instanceof Error ? error.message :Messages.SERVER_ERROR,
  //     });
  //   }
  // };
}
