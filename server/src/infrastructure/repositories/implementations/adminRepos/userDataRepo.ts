import { userDataRepoI } from "../../../../domain/interfaces/admin/userDataRepoI";
import UserModel from "../../../../domain/models/User";

export class UserDataRepo implements userDataRepoI {
  async findFreelancer(): Promise<any> {
    const result = await UserModel.find({role:"freelancer"});
    return result;
  }
  async findClient(): Promise<any> {
    const result = await UserModel.find({role:"client"});
    return result;
  }
  async find(): Promise<any> {
    const result = await UserModel.find();
    return result;
  }
}
