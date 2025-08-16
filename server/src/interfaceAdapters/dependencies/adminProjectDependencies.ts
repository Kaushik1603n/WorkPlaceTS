import { IAdminProjectRepo } from "../../domain/interfaces/admin/adminProjectRepoI";
import { AdminProjectRepo } from "../../infrastructure/repositories/implementations/adminRepos/adminProjectRepo";
import { AdminProjectUseCase } from "../../useCase/admin/adminProjectUseCase";
import { IAdminProjectUseCase } from "../../useCase/Interface/IAdminProjectUseCase";
import { AdminProjectController } from "../controllers/adminControllers/adminProjectController";

export const createAdminProjectDependencies = () => {
  const adminProjectRepo: IAdminProjectRepo = new AdminProjectRepo();
  const adminProjectUseCase: IAdminProjectUseCase = new AdminProjectUseCase(
    adminProjectRepo
  );
  const adminProjectCondroller = new AdminProjectController(
    adminProjectUseCase
  );
  return adminProjectCondroller;
};
