import { RequestHandler } from "express";
import { UserUseCase } from "../../../useCase/admin/userUseCase";
import { UserDataRepo } from "../../../infrastructure/repositories/implementations/adminRepos/userDataRepo";

const userRepo = new UserDataRepo();
const userData = new UserUseCase(userRepo);

export class UserDataController {
  getFreelancerData: RequestHandler = async (req, res): Promise<any> => {
    console.log(req.user);

    const freelancer = await userData.getFreelancerData();

    res.status(200).json({ data: "success", freelancer });
  };

  getClientData: RequestHandler = async (req, res): Promise<any> => {
    console.log(req.user);

    const client = await userData.getClientData();

    res.status(200).json({ data: "success", client });
  };

  getUsersData: RequestHandler = async (req, res): Promise<any> => {
    console.log(req.user);
    const users = await userData.getUsersData();

    res.status(200).json({ data: "success", users });
  };
}
