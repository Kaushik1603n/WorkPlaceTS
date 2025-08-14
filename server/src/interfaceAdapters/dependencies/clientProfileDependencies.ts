import { clientRepoI } from "../../domain/interfaces/IclientRepo";
import { userRepoI } from "../../domain/interfaces/IuserRepo";
import { ClientRepo } from "../../infrastructure/repositories/implementations/clientRepos/clientProfileRepo";
import { UserRepo } from "../../infrastructure/repositories/implementations/userRepo";
import { ClientProfileUserCase } from "../../useCase/clientProfileUseCase";
import { IClinetProfileUseCase } from "../../useCase/Interface/IClientProfileUseCase";
import { profileCondroller } from "../controllers/clientController/profileControllers";

export const clientProfileDependencies =()=>{
    const clientProfileRepo:clientRepoI = new ClientRepo()
    const userRepo:userRepoI = new UserRepo()
    const clientProfileUserCase:IClinetProfileUseCase = new ClientProfileUserCase(clientProfileRepo,userRepo)
    const clientProfileCondroller = new profileCondroller(clientProfileUserCase)
    return clientProfileCondroller;
}
