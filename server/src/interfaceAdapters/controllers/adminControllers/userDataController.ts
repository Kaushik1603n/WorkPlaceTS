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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = req.query.search as string || "";


    const data = await userData.getUsersData(page,limit,search);
    console.log(data);

    res.status(200).json({success:true ,message: "success", data });
  };
}
