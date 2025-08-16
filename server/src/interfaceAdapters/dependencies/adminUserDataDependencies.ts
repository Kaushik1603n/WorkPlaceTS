import { userDataRepoI } from "../../domain/interfaces/admin/userDataRepoI";
import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";
import { UserUseCase } from "../../useCase/admin/userUseCase";
import { IAdminUserUseCase } from "../../useCase/Interface/IAdminUserUseCase";
import { AdminProjectController } from "../controllers/adminControllers/adminProjectController";

export const createAdminUserDataDependencies = () => {
  const adminUserRepo: userDataRepoI = new UserDataRepo();
  const adminUserUseCase: IAdminUserUseCase = new UserUseCase(adminUserRepo);
  const adminUserCondroller = new AdminProjectController(adminUserUseCase);
  return adminUserCondroller;
};
