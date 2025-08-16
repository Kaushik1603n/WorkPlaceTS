import { IProposalRepo } from "../../domain/interfaces/IProposalRepo";
import { ProposalRepo } from "../../infrastructure/repositories/implementations/marketPlace/proposalRepo";
import { IProposalUseCase } from "../../useCase/Interface/IProposalUseCase";
import { ProposalUseCase } from "../../useCase/proposalUseCase";
import { ProposalController } from "../controllers/marketPlaceController/proposalController";

export const createProposalDependencies = () => {
  const proposalRepo: IProposalRepo = new ProposalRepo();
  const proposalUseCase: IProposalUseCase = new ProposalUseCase(proposalRepo);
  const proposalCondroller = new ProposalController(proposalUseCase);
  return proposalCondroller;
};
