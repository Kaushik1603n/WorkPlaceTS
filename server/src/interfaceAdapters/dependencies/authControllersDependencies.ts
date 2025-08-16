import { userRepoI } from "../../domain/interfaces/IuserRepo";
import { UserRepo } from "../../infrastructure/repositories/implementations/userRepo";
import { AuthUseCase } from "../../useCase/authUseCase";
import { IAuthUseCase } from "../../useCase/Interface/IAuthUseCase";
import { AuthControllers } from "../controllers/authControllers";

export const createAuthDependencies = () => {
  const userRepo: userRepoI = new UserRepo();
  const userUseCase: IAuthUseCase = new AuthUseCase(userRepo);
  const userCondroller = new AuthControllers(userUseCase);
  return userCondroller;
};