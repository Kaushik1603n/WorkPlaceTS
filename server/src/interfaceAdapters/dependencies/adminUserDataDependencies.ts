import { userDataRepoI } from "../../domain/interfaces/admin/userDataRepoI";
import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";
import { UserUseCase } from "../../useCase/admin/userUseCase";
import { IAdminUserUseCase } from "../../useCase/Interface/IAdminUserUseCase";
import { UserDataController } from "../controllers/adminControllers/userDataController";

export const createAdminUserDataDependencies = () => {
  const adminUserRepo: userDataRepoI = new UserDataRepo();
  const adminUserUseCase: IAdminUserUseCase = new UserUseCase(adminUserRepo);
  const adminUserCondroller = new UserDataController(adminUserUseCase);
  return adminUserCondroller;
};
