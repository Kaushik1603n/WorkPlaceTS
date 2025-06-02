import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";

export class UserUseCase {
  constructor(private user: UserDataRepo) {
    this.user = user;
  }

  async getFreelancerData(page: number, limit: number, search: string) {
    const freelancer = this.user.findFreelancer(page, limit, search);
    return freelancer;
  }

  async getClientData(page: number, limit: number, search: string) {
    const client = this.user.findClient(page, limit, search);
    return client;
  }

  async getUsersData(page: number, limit: number, search: string) {
    const users = this.user.find(page, limit, search);
    return users;
  }
  async userAction(userId: string, status: string) {
    const users = this.user.findOneByIdAndUpdate(userId, status);
    return users;
  }
}
