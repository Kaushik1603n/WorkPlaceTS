import { RequestHandler } from "express";
import { ProposalUseCase } from "../../../useCase/proposalUseCase";
import { ProposalRepo } from "../../../infrastructure/repositories/implementations/marketPlace/proposalRepo";

const proposal = new ProposalRepo();
const proposalCase = new ProposalUseCase(proposal);
export class ProposalController {
  hireRequest: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const proposalId = req.params.proposalId;

      if (!userId) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      if (!proposalId) {
        res
          .status(400)
          .json({ success: false, message: "Proposal ID is required" });
        return;
      }

      await proposalCase.hireRequestUseCase(userId, proposalId);

      res.status(200).json({
        success: true,
        message: "Hire request processed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process hire request",
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
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const proposals = await proposalCase.getAllFreelancerProposalsUseCase(
        userId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };
  getAllPropjectProposals: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const jobId = req.params.id;

      if (!jobId) {
        res.status(401).json({ message: "jobId Require" });
        return;
      }
      if (!userId) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const proposals = await proposalCase.getAllProjectProposalsUseCase(jobId);

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };

  getContractDetails: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      if (!userId) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const contractDetails = await proposalCase.getContractDetailsUseCase(
        contractId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };

  acceptProposalcontract: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      if (!userId) {
        res.status(401).json({ message: "user not authenticated" });
        return;
      }

      const contractDetails = await proposalCase.acceptProposalUseCase(
        userId,
        contractId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };

  rejectProposalcontract: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      const contractId = req.params.id;

      const contractDetails = await proposalCase.rejectProposalUseCase(
        userId,
        contractId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: contractDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
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
      const data = await proposalCase.proposalMilestonesUseCase(jobId);

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
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
      const data = await proposalCase.proposalMilestonesApproveUseCase(
        milestoneId,
        userId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
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
      const data = await proposalCase.proposalMilestonesRejectUseCase(
        milestoneId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
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

      const { data, totalPages,totalCount } = await proposalCase.pendingPamentsUseCase(
        userId,
        page,
        limit
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: data,
        totalPages,
        totalCount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
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

  //     res.status(200).json({
  //       message: "Proposals fetched successfully",
  //       data: order
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       success: false,
  //       error:
  //         error instanceof Error ? error.message : "Failed to get proposal",
  //     });
  //   }
  // };
}
