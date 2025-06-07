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
}
