import { IProjectRepo } from "../../domain/interfaces/IProjectRepo";
import { ProjectRepo } from "../../infrastructure/repositories/implementations/clientRepos/clientProjectRepo";
import { ClientProjectUserCase } from "../../useCase/clientProjectUseCase";
import { IClinetProjectUseCase } from "../../useCase/Interface/IClientProjectUseCase";
import { ProjectController } from "../controllers/clientController/projectController";

export const createClinetProjectDependencies = () => {
  const clientProjectRepo: IProjectRepo = new ProjectRepo();
  const clientProjectUseCase: IClinetProjectUseCase =
    new ClientProjectUserCase(clientProjectRepo);
  const clientProjectCondroller = new ProjectController(clientProjectUseCase);
  return clientProjectCondroller;
};
