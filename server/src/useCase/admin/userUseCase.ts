import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";

export class UserUseCase {
  constructor(private user: UserDataRepo) {
    this.user = user;
  }

  async getFreelancerData() {
    const freelancer =this.user.findFreelancer();
    return freelancer;
  }

  async getClientData() {
   const client =this.user.findClient();
    return client;
  }

  async getUsersData() {
    const users =this.user.find();
    return users;
  }
}
