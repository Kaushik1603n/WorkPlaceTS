import { IfreelancerRepo } from "../../domain/interfaces/IfreelancerRepo";
import { userRepoI } from "../../domain/interfaces/IuserRepo";
import { FreelancerRepo } from "../../infrastructure/repositories/implementations/freelancerRepos/freelancerRepos";
import { UserRepo } from "../../infrastructure/repositories/implementations/userRepo";
import { FreelancerProfileUseCase } from "../../useCase/freelancerProfileUseCase";
import { IFreelancerProfileUseCase } from "../../useCase/Interface/IFreelancerProfileUseCase";
import { freelancerProfileControllers } from "../controllers/freelancerController/profileController";

export const createFreelancerProfileDependencies = () => {
  const freelancerProfileRepo: IfreelancerRepo = new FreelancerRepo();
  const userRepo: userRepoI = new UserRepo();
  const freelancerProfileUsecase: IFreelancerProfileUseCase =
    new FreelancerProfileUseCase(freelancerProfileRepo, userRepo);
  const freelancerControllers = new freelancerProfileControllers(
    freelancerProfileUsecase
  );
  return freelancerControllers;
};
